import { Album, Photo, PhotoMetaData } from "../models/Album";
import { Coordinates } from "../models/Utils";
import { getLocationDateForPhoto, getWeatherOnDate } from "../services";
import { generateTitles } from "./TitleGenerator";

// Radius of the earth
const RADIUS = 6371;
const DEGREE = 180;

// Constraints for requerying endpoints
const MAX_DISTANCE_KM = 5;

/**
 * 
 * MIT License, refactored from 
 * https://github.com/thealmarques/haversine-distance-typescript/blob/master/index.ts
 * 
 * Calculates the distance (in kms) between point A and B using earth's radius as the spherical surface
 * @param pointA Coordinates from Point A
 * @param pointB Coordinates from Point B
 * Based on https://www.movable-type.co.uk/scripts/latlong.html
 */
const getEstimatedDistance = (pointA: Coordinates, pointB: Coordinates): number => { 

    // convert latitude and longitude to radians
    const deltaLatitude = (pointB.latitude - pointA.latitude) * Math.PI / DEGREE;
    const deltaLongitude = (pointB.longitude - pointA.longitude) * Math.PI / DEGREE;

    const halfChordLength = Math.cos(
        pointA.latitude * Math.PI / DEGREE) * Math.cos(pointB.latitude * Math.PI / DEGREE) 
        * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
        + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

    const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

    return RADIUS * angularDistance;
}

/**
 * Takes a raw text string array of CSV data and parses it into an 
 * array of PhotoMetaData containing the timestamp, and coordinates
 * (lat, long) of said photo meta data.
 * @param {string[]} data The CSV data to parse
 * @returns {PhotoMetaData[]} The set of metadata from the csv file
 */
const parseCSVDataIntoMetaData = (data: string[]): PhotoMetaData[] => {
    return data.map((row) => {
        const [timestamp, latitude, longitude] = row.split(',');
        return {timestamp, coordinates: {latitude: +latitude, longitude: +longitude}} as PhotoMetaData;
    });
}

/**
 * Parses an array of photo meta data and returns an array of photos.
 * The photos contain further details such as weather, temperature etc.
 * @param {PhotoMetaData[]} metaData The data that can be used to correlate further data
 * @returns {Promise<Photo[]>} Returns the array of photos
 */
const parseMetaDataIntoPhotoArray = async (metaData: PhotoMetaData[]): Promise<Photo[]> => {
    
    // Used as a reference to determine whether fetch calls are required
    let lastPhoto: Photo = undefined!;

    let photos: Photo[] = [];

    for(const data of metaData)
    {
        const lat = data.coordinates.latitude;
        const long = data.coordinates.longitude;
  
        const newPhotoTime = new Date(data.timestamp);
  
        // We'll use these to identify whether further fetch calls are required
        let majorDistanceBetweenLastPhoto: boolean = true;
        let majorTimeDifference: boolean = true;
  
        const newPhoto: Photo = {...lastPhoto};
        newPhoto.coordinates = data.coordinates;
        newPhoto.timestamp = data.timestamp;

        // To avoid hitting the endpoint every single time, we only issue a fetch when we notice that either
        // a. Massive distance change greater than ~5km in long/lat
        // b. A day has passed between photographs
        if(lastPhoto != undefined)
        {
          const oldPhotoTime = new Date(lastPhoto.timestamp);
          // Calculate if the distance from the last photo is greater than the current photo
          majorDistanceBetweenLastPhoto = getEstimatedDistance(lastPhoto.coordinates, data.coordinates) > MAX_DISTANCE_KM;
          // We want to check if there is disparity in days, if so then this could affect weather, etc
          majorTimeDifference = Math.ceil(Math.abs((oldPhotoTime.getTime() - newPhotoTime.getTime()) / 86400000)) > 1;
        }

        if(majorDistanceBetweenLastPhoto || majorTimeDifference)
        {
            try
            {
                const fetchGeoLocationData = await getLocationDateForPhoto(data.coordinates);
                // This is an API call to a very restrictive end point that gets upset if we spam it often.
                // Normally the format for retreiving the data from the JSON is:
                // newPhoto.weather = temperatureData[0].hourly[3].weatherDesc[0].value;
                // newPhoto.temperature = temperatureData[0].avgtempC;

                //const temperatureData = await getWeatherOnDate(newPhotoTime.toISOString(), data.coordinates);
                const address = fetchGeoLocationData.items[0].address;
                newPhoto.country = address.countryName;
                newPhoto.city = address.city;
                newPhoto.state = address.state;
                newPhoto.weekend = newPhotoTime.getDay() % 6 == 0;
                newPhoto.weather = 'Sunny';
                newPhoto.temperature = 15;
            }
            catch(error)
            {
                console.warn('Failed to identify metadata of photo - ' + error);
            }
        }

        lastPhoto = newPhoto;
        photos.push(newPhoto);
    }

    return photos;
};

/**
 * Forms an album object from photos and tries to formulate
 * sensible titles for the album based on the correlated
 * metadata harvested.
 * @param {Photo[]} photos The photos form an album out of
 * @returns {Album} The album created
 */
const parseMetaDataIntoAlbum = (photos: Photo[]): Album => {
    let album: Album = 
    {
        photos: photos,
        suggestedTitles: [],
        averageTemperature: photos.reduce((a, b) => a + (+b.temperature), 0) / photos.length,
        country: photos[0].country,
        weather: photos[0].weather
    }
    album.suggestedTitles = generateTitles(album);
    return album;
};

export {parseMetaDataIntoAlbum, parseCSVDataIntoMetaData, parseMetaDataIntoPhotoArray, getEstimatedDistance};