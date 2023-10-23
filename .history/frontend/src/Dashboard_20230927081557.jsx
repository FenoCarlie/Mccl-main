import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT/data?start_date=START_DATE&end_date=END_DATE');
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
    <div>
        <h1>Dashboard</h1>
        <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="category" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date_in" />
      <YAxis />
      <Tooltip />
    </LineChart>
    </div>
  )
}

export default Dashboard
