import cronTime from 'cron-time-generator';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';
import { twitterReadWriteClient } from './twitterClient';
import { generate } from './utils/customImageFactory';
import { getBNBPrice } from './utils/pancakeswap';
import { tweetUpdate } from './utils/tweetHelper';

const previousPriceFilePath = path.join(__dirname, 'previousBNBPrice.json');
const percentageDifferenceToTweet = 0.5;

const main = async () => {
  console.log('Running bot...');
  try {
    const bnbPrice = await getBNBPrice();
    const previousPriceJson = fs.readFileSync(previousPriceFilePath, 'utf8');
    const previousPriceObj = JSON.parse(previousPriceJson);
    const difference = Number(bnbPrice) - Number(previousPriceObj.price);
    const percentageChange = (difference / Number(previousPriceObj.price)) * 100;
    if (Math.abs(percentageChange) < percentageDifferenceToTweet) {
      console.log(`Price difference not upto ${percentageDifferenceToTweet}% of the previously tweeted price: `);
      console.log({
        lastPriceTweeted: previousPriceObj.price,
        currentPrice: bnbPrice,
        priceDifference: `${percentageChange}%`,
      });
      return;
    }

    const changeType = Math.max(0, percentageChange) === 0 ? 'negative' : 'positive';
    // generate tweet image
    const generatedImageBuffer = await generate(`$${Number(bnbPrice).toFixed(2)}`);
    await tweetUpdate({
      client: twitterReadWriteClient,
      BNBPriceString: Number(bnbPrice).toFixed(2),
      changeType,
      generatedImageBuffer,
    });

    // update the price file
    fs.writeFileSync(previousPriceFilePath, JSON.stringify({ price: bnbPrice }));
  } catch (error: any) {
    console.log(error);
    process.exit();
  }
};

const cronTimeString = cronTime.every(5).minutes();

cron.schedule(cronTimeString, main);
