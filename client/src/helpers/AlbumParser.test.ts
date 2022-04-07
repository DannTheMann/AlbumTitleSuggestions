import { PhotoMetaData } from '../models/Album';
import { Coordinates } from '../models/Utils';
import { getEstimatedDistance, parseCSVDataIntoMetaData } from './AlbumParser';

const data : string[] = 
[
 "2020-03-30 14:12:19,40.728808,-73.996106",
 "2020-03-30 14:20:10,40.728656,-73.998790",
 "2020-03-30 14:32:02,40.727160,-73.996044"
];

const cordA : Coordinates = {latitude: 51.1480158, longitude: -0.1275243} // 51.1480158,-0.1275243,14
const cordB : Coordinates = {latitude: 51.1128623, longitude: -0.1782884} // 51.1128623,-0.1782884
const cordC : Coordinates = {latitude: 51.3587144, longitude: 1.1411596} // 51.3587144,1.1411596

describe("AlbumParser Tests", () => {

    test('parseCSVDataIntoMetaData_getEstimatedDistanceSmall', () => {
        const distance: number = getEstimatedDistance(cordA, cordB);
        expect(distance).toBe(5);
    });

    test('parseCSVDataIntoMetaData_getEstimatedDistanceHigh', () => {
        const distance: number = getEstimatedDistance(cordA, cordC);
        expect(distance).toBe(91);
    });

    test('parseCSVDataIntoMetaData_getEstimatedDistanceWrong', () => {
        const distance: number = getEstimatedDistance(cordA, cordC);
        expect(distance).not.toBe(23);
    });

    test('parseCSVDataIntoMetaData_shouldParseCorrectly', () => {
        const res: PhotoMetaData[] = parseCSVDataIntoMetaData(data);
        expect(res.length === 3).toBeTruthy();
        expect(res.find((i)=>i.timestamp=='2020-03-30 14:12:19')).toBeTruthy();
    });

    test('parseCSVDataIntoMetaData_shouldParseIncorrectly', () => {
        const res: PhotoMetaData[] = parseCSVDataIntoMetaData(['d,d,d,ddffff', '2020-03-30 14:20:10,40.728656,-73.998790']);
        expect(res.length).toBe(0);
    });

});