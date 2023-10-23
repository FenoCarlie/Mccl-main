import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Utilisez axios ou fetch pour récupérer les données de votre API
    axios.get('http://localhost:8081/api/import-export')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          width={400}
          height={200}
          data={data} // Utilisez les données récupérées ici
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" /> {/* Utilisez la clé appropriée pour la date */}
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Export" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Ipmort" stroke="#82ca9d" /> {/* Assurez-vous d'utiliser la clé correcte pour l'import */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
