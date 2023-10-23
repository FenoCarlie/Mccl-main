import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

export default function Container() {
  const [container, setContainer] = useState([]);
  const [loading, setLoading] = useState(false);

  const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#efefef',
        },
    },
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'uppercase',
        },
    },
    cells :{
        style: {
            fontSize: '15px',
        },
    },
}

  const columns = [
    { name: "Number of container", selector: "num_container" },
    { name: "Name of container", selector: "name_container" },
    { name: "Type", selector: "type" },
    { name: "Category", selector: "category" },
    { name: "Status", selector: "status" },
    { name: "Live", selector: "live" },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <Link className="btn-edit" to={`/container/${row.id_container}`}>Update</Link>
          <button className="btn-delete" onClick={() => onDeleteClick(row.id_container)}>Delete</button>
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
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Container</h1>
      <input type='text' onChange={handeleFilter} />
      <Link className="btn-add" to="/container/new">
        Add new
      </Link>
    </div>
    <div className="card animated fadeInDown .table-container">
      <DataTable
        columns={columns}
        data={container}
        customStyles={customStyles}
        pagination
      />
    </div>
  </div>
  </div>
);
}