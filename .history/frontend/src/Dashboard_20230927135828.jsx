import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [startDate, setStartDate] = useState(formatDateToYYYYMMDD(firstDayOfMonth));

  const [endDate, setEndDate] = useState(formatDateToYYYYMMDD(currentDate));

  const fetchData = () => {
    setIsLoading(true);
    const formattedStartDate = formatDateToYYYYMMDD(new Date(startDate));
    const formattedEndDate = formatDateToYYYYMMDD(new Date(endDate));
   
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
    fetchData();
  }, [startDate, endDate]);
  
  const formatXAxisDate = (date) => {
    const formattedDate = new Date(date);
    return formatDateToYYYYMMDD(formattedDate);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div  className='diagram card'>
      <h1 className='center'>Import/Export diagram</h1>
        <div className='align'></div>
      </div>
    </div>
  );
}

export default Dashboard;
