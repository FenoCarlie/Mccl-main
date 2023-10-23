import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Container() {
    const [container, setContainer] = useState([]);
  const [loading, setLoading] = useState(false);

  const column = [
    {name: "Number of container"},
    {name: "Name of container"},
    {name: "Type"},
    {name: "Category"},
    {name: "status"},
    {name: "Live"},
    {name: "Code of location T.P"},
    {name: "Name of T.P"},
    {name: "Position"},
    {name: "Client name"},
    {name: "location code T.P"},
    {name: "Forwarding agent"},
    {name: "booking number"},
  ]

  const getContainer = () => {
    setLoading(true);
    axios
      .get('http://localhost:8081/')
      .then(({ data }) => {
        setLoading(false);
        setContainer(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error('An error occurred while fetching the data:', error);
      });
  };

  useEffect(() => {
    getContainer();
  }, []);

  const onDeleteClick = (id_container) => {
    if (!window.confirm('Are you sure you want to delete this data?')) {
      return;
    }
    axios
      .delete(`http://localhost:8081/delete/${id_container}`)
      .then((response) => {
        getContainer();
        console.log(response.data);
      })
      .catch((error) => {
        console.error('An error occurred while deleting the container:', error);
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Container</h1>
        <Link className="btn-add" to="/container/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        
      </div>
    </div>
  );
}
