import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');

  const fetchData = () => {
    setIsLoading(true);
    // Effectuer une requête GET à votre API en incluant les dates de début et de fin
    fetch(`http://localhost:8081/api/data-by-date?start=${startDate}&end=${endDate}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // Charger les données initiales
  }, [startDate, endDate]);


  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Contrôles d'interface utilisateur pour choisir les dates */}
      <div>
        <label>Date de début:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>Date de fin:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Bouton de validation */}
      <button onClick={fetchData}>Valider</button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            width={600}
            height={300}
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
            <Line type="monotone" dataKey="export_count" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="import_count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Dashboard;
