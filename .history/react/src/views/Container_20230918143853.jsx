import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

export default function Container() {
  const [container, setContainer] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { name: "Number of container", selector: "num_container" },
    { name: "Name of container", selector: "name_container" },
    { name: "Type", selector: "type" },
    { name: "Category", selector: "category" },
    { name: "Status", selector: "status" },
    { name: "Live", selector: "live" },
    { name: "Code of location T.P", selector: "tp_location" },
    { name: "Name of T.P", selector: "tp_name" },
    { name: "Position", selector: "position" },
    { name: "Client name", selector: "client_name" },
    { name: "Location code T.P", selector: "code_location_tp" },
    { name: "Forwarding agent", selector: "Forwarding_agent" },
    { name: "Booking number", selector: "booking_number" },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="btn-delete" onClick={() => onUpdateClick(row.id_container)}>Update</button>
          <button className="btn-edit" onClick={() => onDeleteClick(row.id_container)}>Delete</button>
        </div>
      ),
    },
  ];

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

  const onDeleteClick = (idContainer) => {
    if (!window.confirm('Are you sure you want to delete this data?')) {
      return;
    }
    axios
      .delete(`http://localhost:8081/delete/${idContainer}`)
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
      <DataTable
        columns={columns}
        data={container}
        customStyles={{
          rows: {
            style: {
              td: {
                colSpan: "5",
                textAlign: "center",
              },
            },
          },
        }}
      />
      </div>
    </div>
  );
}