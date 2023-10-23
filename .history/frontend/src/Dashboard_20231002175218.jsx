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
import { format, addMonths, getWeek } from "date-fns";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState("day");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(
    format(addMonths(new Date(), 1), "yyyy-MM-dd")
  );

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:8081/api/import-export?start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          category: item.category,
          date: item.date,
        }));

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

        const aggregateDataByWeek = (data) => {
          const aggregatedData = data.reduce((acc, item) => {
            const dateObj = new Date(item.date);
            const year = dateObj.getFullYear();
            const weekNumber = getWeek(dateObj);
            const dateKey = `${year}-${weekNumber}`;

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

        let chartData = formattedData;

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
  }, [timeUnit, startDate, endDate]);

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
        <div className="select-time-unit">
          <label>Time unit :</label>
          <select onChange={handleTimeUnitChange} value={timeUnit}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div className="in-date">
          <div>
            <label>Start date :</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label>End date :</label>
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </div>
        </div>
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
