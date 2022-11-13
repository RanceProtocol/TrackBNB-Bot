import { TwitterApiReadWrite } from 'twitter-api-v2';
interface ITweetUpdateParams {
  client: TwitterApiReadWrite;
  BNBPriceString: string;
  changeType: 'negative' | 'positive';
  generatedImageBuffer: Buffer;
}
export const tweetUpdate = async ({ client, BNBPriceString, changeType, generatedImageBuffer }: ITweetUpdateParams) => {
  try {
    const mediaId = await client.v1.uploadMedia(generatedImageBuffer, { mimeType: 'image/png' });
    client.v1.createMediaMetadata(`${mediaId}`, {
      alt_text: { text: `BNB Price: $${BNBPriceString}` },
    });
    const tweetString = changeType === 'positive' ? `#BNB Price: $${BNBPriceString}  📈` : `#BNB Price: $${BNBPriceString}  📉`;
    await client.v2.tweet(tweetString, {
      media: { media_ids: [mediaId] },
    });
  } catch (error) {
    throw error;
  }
};
