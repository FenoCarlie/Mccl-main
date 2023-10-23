import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import _ from 'lodash';

function Dashboard() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(lastDayOfMonth.toISOString().split('T')[0]);

    axios.get('http://localhost:8081/api/import-export')
      .then(response => {
        const formattedData = response.data.map(item => ({
          category: item.category,
          date: new Date(item.date).toLocaleDateString(),
        }));

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
  }, []);

  // Filtrez les données en fonction des dates sélectionnées
  const filteredData = data.filter((item) => {
    const date = new Date(item.date).getTime();
    const startDateTimestamp = new Date(startDate).getTime();
    const endDateTimestamp = new Date(endDate).getTime();
    return date >= startDateTimestamp && date <= endDateTimestamp;
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <form>
        <label htmlFor="startDate">Date de début :</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <br />

        <label htmlFor="endDate">Date de fin :</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </form>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          width={400}
          height={200}
          data={filteredData}
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
