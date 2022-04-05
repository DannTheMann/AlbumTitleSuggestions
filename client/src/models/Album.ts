import { Coordinates } from "./Utils";

export interface Album {
    photos: Photo[];
    suggestedTitles: string[];
    averageTemperature: number;
    country: string;
    weather: string;
}

export interface PhotoMetaData {
    timestamp: string;
    coordinates: Coordinates
}

export interface Photo extends PhotoMetaData {
    country: string;
    city: string;
    state: string;
    weather: string;
    temperature: number;
    weekend: boolean;
}