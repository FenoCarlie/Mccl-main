import { useParams } from 'react-router-dom';
import axios from "axios";
import DataTable from "react-data-table-component";
import { useEffect, useState } from 'react';
import Container from './Container';

export default function Historic() {
    let {num_container} = useParams();
    const [loading, setLoading] = useState(false);
    const [historics, setHistorics] = useState({})
    const [filteredContainer, setFilteredContainer] = useState([]);
    /*const [historics, setHistorics] = useState({
        id_container: null,
        client: '',
        date_in:'',
        tp_location: '',
        position: '',
        category: '',
        status: '',
        transport: '',
        date_out: ''
    });*/



    const getContainer = () => {
        if (num_container) {
            setLoading(true)
        axios.get(`http://localhost:8081/container/historic/${num_container}`)
        .then(({ data }) => {
            setLoading(false);
            setHistorics(data[0]);
            setFilteredContainer(data);
        })
        .catch(() => {
        setLoading(false);
        });
        } else {
            console.log('no num_container')
        }
    };

    useEffect(() => {
        getContainer();
    })

    const customStyles = {
        headRow: {
            style: {
            backgroundColor: "#efefef",
            },
        },
        headCells: {
            style: {
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "uppercase",
            },
        },
        cells: {
            style: {
            fontSize: "15px",
            },
        },
        };

        const columns = [
            { name: "Id_container", selector: "id_container"},
            { name: "Booking", selector: "booking" },
            { name: "Client", selector: "client" },
            { name: "Date come", selector: "date_in" },
            { name: "Transport", selector: "transport" },
            { name: "Category", selector: "category" },
            { name: "Status", selector: "status" },
            { name: "Location", selector: "location" },
            { name: "Position", selector: "position" },
            { name: "Date departure", selector: "date_out" },
            {
        }
        ];
        const columnsToDisplay = columns.filter((column) => column.selector !== 'id_container');

  return (
    <>
         <div>
      <div style={{ maxHeight: "900px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        <h1>Container: {num_container}</h1>
        </div>
        <div className="card animated fadeInDown .table-container">
          <DataTable
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
            pagination
          />
        </div>
      </div>
    </div>
    </>
  );
}
