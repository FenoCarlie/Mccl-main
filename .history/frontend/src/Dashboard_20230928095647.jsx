import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérez les éléments du DOM
const dropdownContainer = document.querySelector('.dropdown-container');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Ajoutez un gestionnaire d'événements pour afficher/masquer le menu déroulant
dropdownContainer.addEventListener('click', () => {
  if (dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'block';
  }
});

  useEffect(() => {
    axios.get('http://localhost:8081/api/import-export')
      .then(response => {
        const formattedData = response.data.map(item => ({
          category: item.category,
          date: item.date,
        }));

        const groupedData = formattedData.reduce((acc, item) => {
          const date = item.date.split('T')[0]; // Extract date part
          acc[date] = acc[date] || { date, importCount: 0, exportCount: 0 };
          if (item.category === 'Import') {
            acc[date].importCount++;
          } else if (item.category === 'Export') {
            acc[date].exportCount++;
          }
          return acc;
        }, {});

        const aggregatedData = Object.values(groupedData);

        setData(aggregatedData);
        setLoading(false);
      })
      .catch(error => {
        setError('Erreur lors de la récupération des données : ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className='alert'>Une erreur s'est produite : {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
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
