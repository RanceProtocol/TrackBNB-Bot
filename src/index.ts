import cronTime from 'cron-time-generator';
import cron from 'node-cron';
import { twitterReadWriteClient } from './twitterClient';
import { generate } from './utils/customImageFactory';
import { getBNBPrice } from './utils/pancakeswap';
import { tweetUpdate } from './utils/tweetHelper';
const main = async () => {
  console.log('Running job...');
  try {
    const bnbPrice = await getBNBPrice();
    const generatedImageBuffer = await generate(`$${bnbPrice}`);
    await tweetUpdate({ client: twitterReadWriteClient, BNBPriceString: bnbPrice, generatedImageBuffer });
  } catch (error: any) {
    console.log(error);
  }
};

const cronTimeString = cronTime.everyMinute();

cron.schedule(cronTimeString, main);
