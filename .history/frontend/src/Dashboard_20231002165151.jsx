import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { format, getWeek } from "date-fns"; // Importez les fonctions nécessaires depuis date-fns

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState("month"); // Par défaut, par mois

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/import-export")
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          category: item.category,
          date: item.date,
        }));

        // Fonction pour agréger les données par mois
        const aggregateDataByMonth = (data) => {
          const aggregatedData = data.reduce((acc, item) => {
            const dateParts = item.date.split("-");
            const year = dateParts[0];
            const month = dateParts[1];
            const dateKey = `${year}-${month}`;

            acc[dateKey] = acc[dateKey] || {
              date: dateKey,
              importCount: 0,
              exportCount: 0,
            };

            if (item.category === "Import") {
              acc[dateKey].importCount++;
            } else if (item.category === "Export") {
              acc[dateKey].exportCount++;
            }

            return acc;
          }, {});

          return Object.values(aggregatedData);
        };

        // Fonction pour agréger les données par jour
        const aggregateDataByDay = (data) => {
          const aggregatedData = data.reduce((acc, item) => {
            const dateParts = item.date.split("T")[0];

            acc[dateParts] = acc[dateParts] || {
              date: dateParts,
              importCount: 0,
              exportCount: 0,
            };

            if (item.category === "Import") {
              acc[dateParts].importCount++;
            } else if (item.category === "Export") {
              acc[dateParts].exportCount++;
            }

            return acc;
          }, {});

          return Object.values(aggregatedData);
        };

        // Fonction pour agréger les données par semaine
        const aggregateDataByWeek = (data) => {
          const aggregatedData = data.reduce((acc, item) => {
            const dateObj = new Date(item.date);
            const year = dateObj.getFullYear();
            const weekNumber = getWeek(dateObj);
            const dateKey = `${year}-W${weekNumber}`;

            acc[dateKey] = acc[dateKey] || {
              date: dateKey,
              importCount: 0,
              exportCount: 0,
            };

            if (item.category === "Import") {
              acc[dateKey].importCount++;
            } else if (item.category === "Export") {
              acc[dateKey].exportCount++;
            }

            return acc;
          }, {});

          return Object.values(aggregatedData);
        };

        // Choisissez la fonction d'agrégation en fonction de l'unité de temps
        let chartData = formattedData; // Par défaut, utilisez les données brutes

        if (timeUnit === "month") {
          chartData = aggregateDataByMonth(formattedData);
        } else if (timeUnit === "day") {
          chartData = aggregateDataByDay(formattedData);
        } else if (timeUnit === "week") {
          chartData = aggregateDataByWeek(formattedData);
        }

        setData(chartData);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          "Erreur lors de la récupération des données : " + error.message
        );
        setLoading(false);
      });
  }, [timeUnit]);

  const handleTimeUnitChange = (event) => {
    const selectedTimeUnit = event.target.value;
    setTimeUnit(selectedTimeUnit);
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert">Une erreur s'est produite : {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label>Unité de temps :</label>
        <select onChange={handleTimeUnitChange} value={timeUnit}>
          <option value="month">Par mois</option>
          <option value="day">Par jour</option>
          <option value="week">Par semaine</option>
        </select>
      </div>
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
          <Line
            type="monotone"
            dataKey="importCount"
            name="Import"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="exportCount"
            name="Export"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
