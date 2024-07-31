import sharp from 'sharp';
import { parse } from 'svgson';
import { vectorize } from '@neplex/vectorizer';



/**
 * Function to convert the profile image to an svg file
 * 
 * @param imageBuffer an image of any file type
 * @returns a promise that reloves to the svg string or reject wit an error
 */
export async function convertImagetoSVG(imageBuffer: any): Promise<string> {
    return new Promise((resolve, reject) => {
        sharp(imageBuffer)
        .toFormat('png')
        .toBuffer()
        .then( async (pngBuffer) => {
            const svgImage = await vectorize(pngBuffer);
            if (!svgImage) reject({ error: 'Could not convert image'})
            resolve(svgImage);
        }).catch(reject)
    })
}

/**
 * A function that confirms if the file provided is an svg file
 * 
 * @param svgContent an svg string
 * @returns true if validated and false if not
 */
export async function validateSVG(svgContent: string) {
    try {
        const parsedSVG = await parse(svgContent);

        if (parsedSVG.name === "svg") return true;
    } catch (error) {
        return false;
    }
}
