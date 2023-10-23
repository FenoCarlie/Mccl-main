import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Effectuer une requête GET à votre API ici
    fetch('http://localhost:8081/api/data-by-date')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  const addDataPoint = () => {
    const newData = {
      name: 'Date H',
      Ipmort: 2000,
      Export: 3000,
      amt: 2800,
    };
    setData((prevData) => [...prevData, newData]);
  };

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
          <Line type="monotone" dataKey="Export" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="import_count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={addDataPoint}>Add Data Point</button>
    </div>
  );
}

export default Dashboard;