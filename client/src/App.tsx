import './App.css';
import { getAverageTemperatureOnDate, getCSVFile, getLocationDateForPhoto } from './services';
import { Album, Photo, PhotoMetaData } from './models/Album';
import { getEstimatedDistance, parseCSVDataIntoMetaData, parseMetaDataIntoPhotoArray } from './helpers/AlbumParser';

const datasetUrls: string[] = 
[
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/1.csv',
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/2.csv',
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/3.csv',
]

const albums: Album[] = [];

const showData = async () => {

  // Iterate over 3 album URLs, and fetch their relevant CSV data
  datasetUrls.forEach( async (url)=>{
    const data = await getCSVFile(url);
    const rows = data.split('\n');

    // The album to form
    const album: Album = {photos: [], suggestedTitles: []};


    const metaData: PhotoMetaData[] = parseCSVDataIntoMetaData(rows);
    const photoData: Photo[] = await parseMetaDataIntoPhotoArray(metaData);

    console.warn(photoData);

  });
}

function App() {
  return (
    <div>
      <h1>Suggestions for Album Titles</h1>
      <button onClick={showData}>Test</button>
    </div>
  );
}

export default App;
