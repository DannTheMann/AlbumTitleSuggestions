import './App.css';
import { getCSVFile } from './services';
import { Album, Photo, PhotoMetaData } from './models/Album';
import { parseCSVDataIntoMetaData, parseMetaDataIntoAlbum, parseMetaDataIntoPhotoArray } from './helpers/AlbumParser';
import { useState } from 'react';

// Datasets provided for challenge.
const datasetUrls: string[] = 
[
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/1.csv',
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/2.csv',
  'https://gist.githubusercontent.com/tomjcohen/726d24f1fe2736a16028911c3b544bfc/raw/4e85629b513c6fb15202b4d1410fc03e568a0dcb/3.csv',
]

const getAlbumTitles = async () => {

  // Iterate over 3 album URLs, and fetch their relevant CSV data
  return Promise.all(datasetUrls.map( async (url)=>{
    const data = await getCSVFile(url);
    const rows = data.split('\n');

    // Generate some data
    const metaData: PhotoMetaData[] = parseCSVDataIntoMetaData(rows);
    const photoData: Photo[] = await parseMetaDataIntoPhotoArray(metaData);

    // Create an album object from the photos
    return parseMetaDataIntoAlbum(photoData);

  }));
}

function App() {

  const [albumTitles, setAlbumTitles] = useState<Album[]>([]);

  // Process click when the user generates titles.
  const handleClick = async () => {
    const albums = await getAlbumTitles();
    setAlbumTitles(albums);
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Suggestions for Album Titles</h1>
      <p>Front-end built with React, hosted on Github Pages and utilising TypeScript to generate content.</p>
      <button onClick={handleClick}>Generate Titles</button>
      <hr></hr>

      <div>
        {albumTitles.map((album, i) => (
          <>
            <div key={i}>
              <h3>{album.country} - {album.weather} - {album.averageTemperature}°C</h3>
            {album.suggestedTitles.map((title, j) => (
                <div key={j}>{title}</div>
            ) )}
            </div>
            <hr></hr>
          </>
        ) )}
      </div>
    </div>
  );
}

export default App;
