import sharp from 'sharp';
import { trace } from 'potrace';
import { parse } from 'svgson';
import { string } from 'zod';


export async function convertImagetoSVG(imageBuffer: any): Promise<string> {
    return new Promise((resolve, reject) => {
        sharp(imageBuffer)
        .toFormat('png')
        .toBuffer()
        .then((pngBuffer) => {
            trace(pngBuffer, (err, svg) => {
                if (err) return reject(err);
                resolve(svg)
            })
        }).catch(reject)
    })
}
export async function validateSVG(svgContent: string) {
    try {
        const parsedSVG = await parse(svgContent);

        if (parsedSVG.name === "svg") return true;
    } catch (error) {
        return false;
    }
}
