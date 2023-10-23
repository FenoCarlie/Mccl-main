import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  

function Dashboard() {
  const [data, setData] = useState([
    {
      name: 'Page A',
      Ipmort: 4000,
      Export: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      Ipmort: 3000,
      Export: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      Ipmort: 2000,
      Export: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      Ipmort: 2780,
      Export: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      Ipmort: 1890,
      Export: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      Ipmort: 2390,
      Export: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      Ipmort: 3490,
      Export: 4300,
      amt: 2100,
    },
  ]);

  const addDataPoint = () => {
    const newData = {
      name: 'Page H',
      Ipmort: 2000,
      Export: 3000,
      amt: 2800,
    };
    setData(prevData => [...prevData, newData]);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <ResponsiveContainer width="100%" height={450}>
      <LineChart
          width={500}
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Export" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Ipmort" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={addDataPoint}>Add Data Point</button>
    </div>
  );
}

export default Dashboard;