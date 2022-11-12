import { TwitterApiReadWrite } from 'twitter-api-v2';
interface ITweetUpdateParams {
  client: TwitterApiReadWrite;
  BNBPriceString: string;
  generatedImageBuffer: Buffer;
}
export const tweetUpdate = async ({ client, BNBPriceString, generatedImageBuffer }: ITweetUpdateParams) => {
  try {
    const mediaId = await client.v1.uploadMedia(generatedImageBuffer, { mimeType: 'image/png' });
    client.v1.createMediaMetadata(`${mediaId}`, {
      alt_text: { text: `BNB Price: $${BNBPriceString}` },
    });
    await client.v2.tweet(`#BNB Price: $${BNBPriceString}`, {
      media: { media_ids: [mediaId] },
    });
  } catch (error) {
    throw error;
  }
};
