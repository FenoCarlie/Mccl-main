import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import MapComponent from './views/MapComponent';


const MyChart = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/data?start_date=START_DATE&end_date=END_DATE');
        const jsonData = await response.json();

        // Format the data
        const formattedData = jsonData.map(item => ({
          date_in: item.date_in,
          date_out: item.date_out,
          category: item.category
        }));

        setData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <LineChart width={1200} height={400} data={data}>
      <Line type="monotone" dataKey="category" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date_in" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

const locations = [
  { name: 'Tamatave', latitude: -18.1496, longitude: 49.4029 },
  { name: 'Moramanga', latitude: -18.9333, longitude: 48.2000 },
  { name: 'Antananarivo', latitude: -18.8792, longitude: 47.5079 }
];

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <MyChart />
      <MapComponent locations={locations} />
    </div>
  );
}

export default Dashboard;