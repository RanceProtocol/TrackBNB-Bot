import { registerFont } from 'canvas';
import cronTime from 'cron-time-generator';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';
import { twitterReadWriteClient } from './twitterClient';
import { generate } from './utils/customImageFactory';
import { getBNBPrice } from './utils/pancakeswap';
import { tweetUpdate } from './utils/tweetHelper';

// We need to register our font file to be used in canvas
registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'crimsonText-boldItalic.ttf'), { family: 'crimsontext' });

const previousPriceFilePath = path.join(__dirname, 'previousBNBPrice.json');

const main = async () => {
  console.log('Running job...');
  try {
    const bnbPrice = await getBNBPrice();
    const previousPriceJson = fs.readFileSync(previousPriceFilePath, 'utf8');
    const previousPriceObj = JSON.parse(previousPriceJson);
    const difference = Number(bnbPrice) - Number(previousPriceObj.price);
    const percentageChange = (difference / Number(previousPriceObj.price)) * 100;
    if (Math.abs(percentageChange) < 2)
      return console.log('Price difference not upto 2% of the previously tweeted price: ', {
        lastPriceTweeted: previousPriceObj.price,
        currentPrice: bnbPrice,
        priceDifference: `${percentageChange}%`,
      });
    const changeType = Math.max(0, percentageChange) === 0 ? 'negative' : 'positive';
    // update the price file
    fs.writeFileSync(previousPriceFilePath, JSON.stringify({ price: bnbPrice }));
    // generate tweet image
    const generatedImageBuffer = await generate(`$${Number(bnbPrice).toFixed(2)}`);
    await tweetUpdate({
      client: twitterReadWriteClient,
      BNBPriceString: Number(bnbPrice).toFixed(2),
      changeType,
      generatedImageBuffer,
    });
  } catch (error: any) {
    console.log(error);
    process.exit();
  }
};

const cronTimeString = cronTime.everyMinute();

cron.schedule(cronTimeString, main);
