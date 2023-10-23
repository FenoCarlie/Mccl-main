import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
useEffect(() => {
// Create a map instance and set its initial view to Madagascar
const map = L.map('map').setView([-18.8792, 47.5079], 6);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Add markers for the three points
const points = [
{ name: 'Moramanga', coordinates: [-18.9333, 48.2000] },
{ name: 'Toamasina', coordinates: [-18.1667, 49.3833] },
{ name: 'Antananarivo', coordinates: [-18.8792, 47.5079] },
];

points.forEach((point) => {
L.marker(point.coordinates).addTo(map).bindPopup(point.name);
});
}, []);

return <div id="map" style={{ height: '500px' }}></div>;
};

export default MapComponent;