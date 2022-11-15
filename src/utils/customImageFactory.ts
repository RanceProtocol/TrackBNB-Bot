import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

export const generate = async (priceText: string): Promise<Buffer> => {
  const width = 4888; // width of the image
  const height = 1396; // height of the image
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // We need to register our font file to be used in canvas
  registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'crimsonText-boldItalic.ttf'), { family: 'crimsontext' });
  // Define the font style
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = '#65350f';
  context.font = "600px 'crimsontext' italic";

  // let generatedImagebuffer: Buffer | null = null;
  const generatedImagebuffer = await loadImage(path.join(__dirname, '..', 'assets', 'images', 'template.jpg')).then(
    (image: any) => {
      // Draw the background
      context.drawImage(image, 0, 0, width, height);

      const approxFontHeight = parseInt(context.font);

      // Draw the text
      context.fillText(priceText, width / 2, height / 2 - approxFontHeight / 3);

      fs.writeFileSync(path.join(__dirname, '..', 'assets', 'images', 'generated.png'), canvas.toBuffer('image/png'));
      // Convert the Canvas to a buffer
      return canvas.toBuffer('image/png');
    },
  );
  if (!generatedImagebuffer) throw 'error while generating image';
  return generatedImagebuffer;
};
