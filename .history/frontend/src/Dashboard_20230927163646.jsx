import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]); // État pour stocker les données
  const [totalImport, setTotalImport] = useState(0); // État pour stocker le total d'importations
  const [totalExport, setTotalExport] = useState(0); // État pour stocker le total d'exportations

  useEffect(() => {
    axios.get('http://localhost:8081/api/import-export')
      .then(response => {
        // Utilisez la méthode map pour extraire les données d'export et d'import
        const formattedData = response.data.map(item => ({
          category: item.category,
          date: item.date
        }));
        setData(formattedData); // Stockez les données dans l'état

        // Calculez le total d'importations et d'exportations
        const importTotal = formattedData.filter(item => item.category === 'Import').length;
        const exportTotal = formattedData.filter(item => item.category === 'Export').length;

        setTotalImport(importTotal); // Stockez le total d'importations
        setTotalExport(exportTotal); // Stockez le total d'exportations
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Nombre total d'importations : {totalImport}</p>
      <p>Nombre total d'exportations : {totalExport}</p>
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
          <Line type="monotone" dataKey="category" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
