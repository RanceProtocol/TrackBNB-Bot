import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

export const generate = (price: string) => {
  // Define the canvas
  const width = 4888; // width of the image
  const height = 1396; // height of the image
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // We need to register our font file to be used in canvas
  registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'crimsonText-boldItalic.ttf'), { family: 'crimsontext' });
  // Define the font style
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = '#000';
  context.font = "400px 'crimsontext' italic";

  loadImage(path.join(__dirname, '..', 'assets', 'images', 'template.jpg')).then((image: any) => {
    // Draw the background
    context.drawImage(image, 0, 0, width, height);

    const approxFontHeight = parseInt(context.font);

    // Draw the text
    context.fillText(`$${price}`, width / 2, height / 2 - approxFontHeight / 4);

    // Convert the Canvas to a buffer
    const buffer = canvas.toBuffer('image/png');
    fs.writeFile(path.join(__dirname, '..', 'assets', 'images', 'generated_image.jpg'), buffer, (err) => {
      if (err) console.log(err);
    });
  });
};
