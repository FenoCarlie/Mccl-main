import { MapContainer, TileLayer, Marker } from 'react-leaflet';
     import L from 'leaflet';

     // Define a custom icon for the marker
     const customIcon = L.icon({
       iconUrl: 'marker-icon.png',
       iconSize: [25, 41],
       iconAnchor: [12, 41],
     });

     function Map() {
       return (
         <MapContainer center={[-18.8792, 47.5079]} zoom={6} style={{ height: "100vh", width: "100%" }}>
           <TileLayer
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
           />
           <Marker position={[-18.8792, 47.5079]} icon={customIcon}>
             {/* Add additional marker content, like a popup */}
           </Marker>
         </MapContainer>
       );
     }
     export default Map;