import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Fonction pour formater la date en "YYYY-MM-DD"
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation de la date de début au mois actuel
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [startDate, setStartDate] = useState(formatDateToYYYYMMDD(firstDayOfMonth));

  const [endDate, setEndDate] = useState(formatDateToYYYYMMDD(currentDate)); // Date de fin par défaut

  const fetchData = () => {
    setIsLoading(true);
    // Formater les dates de début et de fin avant de les utiliser
    const formattedStartDate = formatDateToYYYYMMDD(new Date(startDate));
    const formattedEndDate = formatDateToYYYYMMDD(new Date(endDate));

    // Effectuer une requête GET à votre API en incluant les dates de début et de fin
    fetch(`http://localhost:8081/api/data-by-date?start=${formattedStartDate}&end=${formattedEndDate}`)
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

  // Fonction de formatage des dates pour l'axe des abscisses
  const formatXAxisDate = (date) => {
    const formattedDate = new Date(date);
    return formatDateToYYYYMMDD(formattedDate);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
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
            <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
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
