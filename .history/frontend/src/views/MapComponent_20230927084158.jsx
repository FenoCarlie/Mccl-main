import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ locations }) => {
  const center = [-18.8792, 47.5079]; // Coordinates of the center of Madagascar

  return (
    <Map center={center} zoom={8} style={{ height: '400px' }}>
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