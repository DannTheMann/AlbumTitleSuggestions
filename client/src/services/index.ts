import { Coordinates } from "../models/Utils";

const WEATHER_API_KEY = "4ecb3809c6684284899145248220504";
const HERE_DOT_COM_API_KEY = "Znc7h30xPVDLqOCjKagiaN7z8seznJDP7_ZTOK3-V6M";

const getLocationDateForPhoto = async (coordinates: Coordinates): Promise<any> => {
    
    const data = await fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coordinates.latitude}%2C${coordinates.longitude}&lang=en-US&apiKey=${HERE_DOT_COM_API_KEY}`)
    if(data.ok)
    {
        const res = await data.json();
        if(res.items) return res;
        else Promise.reject('Query response format was incorrect, JSON=' + JSON.stringify(res));
    }
    else
    {
        return Promise.reject('Failed to Query Location Data, status' + data.status + " (" + data.statusText + ")");
    }
}

const getAverageTemperatureOnDate = async (date: string, coordinates: Coordinates): Promise<number> => {
    
    const geoTemperature = await fetch(`http://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=${coordinates.latitude}%2C${coordinates.longitude}4&key=${WEATHER_API_KEY}&date=2020-03-30&format=json`);
        
    if(geoTemperature.ok)
    {
        const json = await geoTemperature.json();
        return json.data.weather[0].avgtempC;
    }
    else
    {
        return Promise.reject('Failed to Query Temperature Data, status' + geoTemperature.status + " (" + geoTemperature.statusText + ")");
    }

}

const getCSVFile = async (url: string): Promise<string> => {
    const res = await fetch(url);
    if(res.ok)
    {
        return res.text();
    }
    else
    {
        return Promise.reject('Failed to Query Location Data, status' + res.status + " (" + res.statusText + ")");
    }
};

export {getCSVFile, getAverageTemperatureOnDate, getLocationDateForPhoto};