import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

function App() {
  return (
    <MapContainer center={[-18.8792, 47.5079]} zoom={6} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />
    </MapContainer>
  );
}

export default App;