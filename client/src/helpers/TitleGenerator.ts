import { Album } from "../models/Album";

const TITLE_PREFIXS = [
    "Adventure in ",
    "Trip to ",
    "Escape to ",
    "Dreaming of ",
]

const TITLES_TO_GENERATE: number = 10;

const coinFlip = (): boolean => 
{
    return Math.floor(Math.random() * 2) == 1;
}

const generateTitles = (album: Album): string[] =>
{
    let titles: string[] = [];
    
    // Debug only owing to API issue mentioned below
    let temp = Math.random() * 50;
    if(coinFlip()) temp *= -1; // Make negative

    for(let i = 0; i <= TITLES_TO_GENERATE; i++)
    {
        let title = "";

        if(coinFlip()) title += TITLE_PREFIXS[Math.floor(Math.random() * TITLE_PREFIXS.length)];
        else if(coinFlip() && album.photos[0].weekend) 
        {
            if(coinFlip()) title += album.weather;
            title +=  coinFlip() ? " weekend in " : " weekend away in ";
        }
        else title += album.weather + " day in ";
        
        
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