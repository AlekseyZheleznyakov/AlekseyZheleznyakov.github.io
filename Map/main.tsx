import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Map, { Marker } from './node_modules/react-map-gl/dist/es5/exports-maplibre';

const App = () => {
  const [lattitude, setLat] = useState(0);
  const [longitude, setLgtd] = useState(0);
  const [country, setCountry] = useState("undefined");
  const [city, setCity] = useState("undefined");
  const [temp, setTemp] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHum] = useState(0);
  const [pressure, setPres] = useState(0);

  function OnMapClick(e: any) {
    const key = "89baa02bce499fdd7753f855517a5ff1";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}&appid=${key}`;

    fetch(url).then((myweather) => {
      myweather.text().then((wthr) => {
        let weather = JSON.parse(wthr);

        setLat(e.lngLat.lat);
        setLgtd(e.lngLat.lng);
        setCountry(weather.sys.country);
        setCity(weather.name);
        setTemp(weather.main.temp);
        setWind(weather.wind.speed);
        setHum(weather.main.humidity);
        setPres(weather.main.pressure);
      })
    })
  };

  return (    
    <div>
      <Map
        onClick={OnMapClick}
        initialViewState={{        
          longitude: -122.4,
          latitude: 37.8,
          zoom: 5
        }}
        style={{width: 2000, height: 600}}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=npDaQxzNFWYxaf2MY7TI"
      >
        <Marker color="red" longitude={longitude} latitude={lattitude}></Marker>
      </Map>
      <br/><br/><br/><br/>
      <table>
        <tbody>
          <tr>
            <th>Lattitude, °</th>
            <th>Longitude, °</th>
            <th>Country</th>
            <th>City</th>
            <th>Temprature, ℃</th>
            <th>Wind speed, m/s</th>
            <th>Humidity, %</th>
            <th>Pressure, mmHg</th>
          </tr>
          <tr>
            <td>{lattitude}°</td>
            <td>{longitude}°</td>
            <td>{country}</td>
            <td>{city}</td>
            <td>{Math.trunc(temp) - 273}℃</td>
            <td>{wind} m/s</td>
            <td>{humidity}%</td>
            <td>{pressure * 0.750062} mmHg</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

async function onLoad() {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = createRoot(rootElement);
    root.render(
      <App></App>
    );
}

export default App;

window.onload = onLoad;
