import { Album } from "../models/Album";

const TITLE_PREFIXS = [
    "Adventure in ",
    "Trip to ",
    "Escape to ",
    "Dreaming of ",
]

const TITLES_TO_GENERATE: number = 10;

/**
 * Imitates a coin flip, generating a true
 * false boolean at 50% chance.
 * @returns {boolean} 
 */
const coinFlip = (): boolean => 
{
    return Math.floor(Math.random() * 2) == 1;
}

/**
 * Generates sensible titles based on the albums metadata
 * forged from the photographs in the album. 
 * @param {Album} album The album to form titles for
 * @returns {string[]} A string array representing titles
 */
const generateTitles = (album: Album): string[] =>
{
    let titles: string[] = [];
    
    // Debug only owing to API issue mentioned below
    let temp = Math.random() * 50;
    if(coinFlip()) temp *= -1; // Make negative

    // Generate X amount of titles...
    for(let i = 0; i <= TITLES_TO_GENERATE; i++)
    {
        let title = "";

        // We can start a title with 'Adventure in' or something similar.
        if(coinFlip()) title += TITLE_PREFIXS[Math.floor(Math.random() * TITLE_PREFIXS.length)];
        // Otherwise we might start with 'Weekend'
        else if(coinFlip() && album.photos[0].weekend) 
        {
            // We can also look to append the weather
            if(coinFlip()) title += album.weather;
            title +=  coinFlip() ? " weekend in " : " weekend away in ";
        }
        else title += album.weather + " day in ";
        
        // Really primitive implementation of providing some form of 'temperature'
        if(coinFlip()) 
        {
            // Normally we'd pull this from here, but as we're in a bit of a pickle with an awkward API
            // we'll randomly generate a fixed temperature for the day.
            //const temp = album.averageTemperature;
            if(temp <= 0)
            {
                title += 'cold ';
            }
            else if(temp >= 30)
            {
                title += 'hot ';
            }
            else if(temp >= 15)
            {
                title += 'warm ';
            }
            else if(temp >= 10)
            {
                title += 'mild ';
            }
            else
            {
                title += 'nippy ';
            }
        }

        // Whether we want to include the country, state etc.
        if(coinFlip()) title += album.country;
        else title += album.photos[0].state;
        
        // Avoid adding the same title
        if(titles.includes(title))
        {
            i--;
        }
        else
        {
            // Push the latest generated title but be sure to uppercase the first letter
            titles.push(title.charAt(0).toUpperCase() + title.slice(1));
        }
    }
    return titles;
} 

export {generateTitles};