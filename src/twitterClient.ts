import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
dotenv.config();

const twitterApiClient = new TwitterApi({
  appKey: process.env.API_KEY as string,
  appSecret: process.env.API_KEY_SECRET as string,
  accessToken: process.env.ACCESS_TOKEN as string,
  accessSecret: process.env.ACCESS_TOKEN_SECRET as string,
});

export const twitterReadWriteClient = twitterApiClient.readWrite;
