import React from 'react';
import { Album, Photo, PhotoMetaData } from '../models/Album';
import { parseCSVDataIntoMetaData, parseMetaDataIntoAlbum, parseMetaDataIntoPhotoArray } from './AlbumParser';

const data : string[] = 
[
 "2020-03-30 14:12:19,40.728808,-73.996106",
 "2020-03-30 14:20:10,40.728656,-73.998790",
 "2020-03-30 14:32:02,40.727160,-73.996044",
 "2020-03-30 14:41:18,40.725468,-73.995701",
 "2020-03-30 14:43:48,40.721983,-74.003248",
 "2020-03-30 14:49:23,40.721332,-74.004535",
 "2020-03-30 15:37:13,40.712115,-74.005764",
 "2020-03-30 15:42:00,40.711887,-74.006150",
 "2020-03-30 15:51:40,40.710944,-74.002933",
 "2020-03-30 17:01:19,40.706225,-74.009415",
 "2020-03-30 18:10:01,40.706485,-74.010359"
];

describe('TitleGenerator Tests', () => {
  
    test('TitleGenerator_generateTitles', async () => {
        const metaData: PhotoMetaData[] = parseCSVDataIntoMetaData(data);
        const photos: Photo[] = await parseMetaDataIntoPhotoArray(metaData);
        const album: Album = parseMetaDataIntoAlbum(photos);
        expect(album.suggestedTitles.length).toBe(11);
    });

    test('TitleGenerator_failGenerateTitles', async () => {
        expect(()=>{
            const album = parseMetaDataIntoAlbum([]);
        }).toThrowError();
    });

});