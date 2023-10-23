import React from 'react';
   import { Map, TileLayer, Marker, Popup } from 'leaflet';
   import 'leaflet/dist/leaflet.css';

   const MapComponent = ({ locations }) => {
     return (
       <Map center={[latitude, longitude]} zoom={8} style={{ height: '400px' }}>
         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         {locations.map((location, index) => (
           <Marker key={index} position={[location.latitude, location.longitude]}>
             <Popup>{location.name}</Popup>
           </Marker>
         ))}
       </Map>
     );
   };

   export default MapComponent;