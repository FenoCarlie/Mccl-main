import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import _ from 'lodash';

function Dashboard() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      axios.get('http://localhost:8081/api/import-export')
        .then(response => {
          let formattedData = response.data.map(item => ({
            category: item.category,
            date: new Date(item.date).toLocaleDateString(),
          }));

          formattedData = formattedData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
          });

          const groupedData = _.groupBy(formattedData, 'date');
       
        const aggregatedData = Object.entries(groupedData).map(([date, transactions]) => ({
          date,
          importCount: transactions.filter(item => item.category === 'Import').length,
          exportCount: transactions.filter(item => item.category === 'Export').length,
        }));

          setData(aggregatedData);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données :', error);
        });
    }
  }, [startDate, endDate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </label>
      <ResponsiveContainer width="100%" height={450}>
      <LineChart
          width={400}
          height={200}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="importCount" name="Import" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="exportCount" name="Export" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;