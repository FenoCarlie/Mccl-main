import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";


export default function GetOut() {
const navigate = useNavigate();
let { id_container } = useParams();
const [filteredContainer, setFilteredContainer] = useState([]);
const [modalOpen, setModalOpen] = useState(false);
const [selectedTransport, setSelectedTransport] = useState('');
const [container, setContainer] = useState({
    num_container: "",
    line:"",
    shipment:"",
    booking:"",
    type:"",
    id_transport:"",
    id_tp:"",
    category:"",
    status:"",
    num_truck:"",
    num_wagon:"",
    num_platform:"",
    tare:"",
    gross_weight:"",
    client:"",
    date_in:"",
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const { setNotification } = useStateContext();


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

const selectContainer = (selectedRow) => {
    setContainer({
    id_container: selectedRow.id_container,
    num_container: selectedRow.num_container,
    type: selectedRow.type,
    line: selectedRow.line,
    tare: selectedRow.tare,
    shipment: selectedRow.shipment,
    booking: selectedRow.booking,
    gross_weight: selectedRow.gross_weight,
    client: selectedRow.client,
    date_in: selectedRow.date_in,
    category: selectedRow.category,
    status: selectedRow.status,
    location: selectedRow.location,
    position: selectedRow.position,
    });
};

const columns = [
    { name: "Id_container", selector: "id_container"},
    { name: "Number of container", selector: "num_container" },
    { name: "line", selector: "line" },
    { name: "type", selector: "type" },
    { name: "tare", selector: "tare" },
    { name: "shipment", selector: "shipment" },
    { name: "booking", selector: "booking" },
    { name: "gross_weight", selector: "gross_weight" },
    { name: "client", selector: "client" },
    { name: "date_in", selector: "date_in" },
    { name: "category", selector: "category" },
    { name: "status", selector: "status" },
    { name: "location", selector: "location" },
    { name: "position", selector: "position" },
    {
    cell: (row) => (
        <div>
        <button
            className="button_pers"
            onClick={() => selectContainer(row)}
            >
            Select
        </button>
        </div>
    ),
    }
];

const columnsToDisplay = columns.filter(
    (column) => 
        column.selector !== 'id_container' &&
        column.selector !== 'line' &&
        column.selector !== 'shipment' &&
        column.selector !== 'booking' &&
        column.selector !== 'gross_weight' &&
        column.selector !== 'client' &&
        column.selector !== 'date_in' &&
        column.selector !== 'status' &&
        column.selector !== 'location' &&
        column.selector !== 'position' &&
        column.selector !== 'type' &&
        column.selector !== 'category' &&
        column.selector !== 'tare');

const getContainer = () => {
    setLoading(true);
    axios
    .get("http://localhost:8081/container/in_progress")
    .then(({ data }) => {
        setLoading(false);
        setContainer(data);
        setFilteredContainer(data); // Initialize filteredContainer with all container data
    })
    .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
    });
};

const onSubmit = (ev) => {
    ev.preventDefault();
    axios
    .post('http://localhost:8081/container/:id_container', container)
    .then(() => {
        setNotification('Container was successfully created');
        navigate('/container');
        setErrors({});
    })
    .catch((err) => {
        if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        }
    });
};


useEffect(() => {
    getContainer();
}, []);


return (
    <>
    <h1>Get out Container</h1>
    <div className="align">
        <div className="card card_width animated fadeInDown">
        <div className="test">
            {loading && (
                <div className="text-center">
                Loading...
                </div>
            )}
            {Object.keys(errors).length > 0 && (
                <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            )}
            {!loading && (
                <form onSubmit={onSubmit}>

            <div className="align">
            <div className="list">
                <ul>
                    <li>Container number: 
                        <label className="info_label"> {container.num_container} </label>
                    </li>
                    <li>Line: 
                        <label className="info_label"> {container.line} </label>
                    </li>
                    <li>Shipment: 
                        <label className="info_label"> {container.shipment} </label>
                    </li>
                    <li>Booking: 
                        <label className="info_label"> {container.booking} </label>
                    </li>
                    <li>Type: 
                        <label className="info_label"> {container.type} </label>
                    </li>
                    <li>Client: 
                        <label className="info_label"> {container.client} </label>
                    </li>
                    <li>Category: 
                        <label className="info_label"> {container.category} </label>
                    </li>
                    <li>Status: 
                        <label className="info_label"> {container.status} </label>
                    </li>
                    <li>Location: 
                        <label className="info_label"> {container.location} </label>
                    </li>
                    <li>Position: 
                        <label className="info_label"> {container.position} </label>
                    </li>
                    <li>Tare: 
                        <label className="info_label"> {container.tare} </label>
                    </li>
                    <li>Gross weight: 
                        <label className="info_label"> {container.gross_weight} </label>
                    </li>
                    <li>Date in: 
                        <label className="info_label"> {container.date_in} </label>
                    </li>
                    <div className="input-container">
                    <input
                    className="input-field"
                    type="date"
                    value={container.date_in}
                    onChange={(ev) => setContainer({ ...container, date_in: ev.target.value })}
                    placeholder="Date In"
                    id="date_in" // Ajoutez un id unique
                  />
                  <label htmlFor="date_in" className="input-label">
                    Date In
                  </label>
                    <span className="input-highlight"></span>
                  </div>
                </ul>
              </div>
            </div>
            <button className="btn">Save</button>
            </form>
            )}
        </div>
        </div>
        <div className="card card_width">
        <div className="form_search_new">
            <input className="input" placeholder="Type your text" required="" type="text"/>
            <span className="input-border"></span>
        </div>
        <DataTable columns={columnsToDisplay} data={filteredContainer} customStyles={customStyles} />
        </div>
        <div className="card card_width">
        <button className="button_pers" onClick={() => {
                setModalOpen(true); // Set the id of the clicked row
            }}>Add new client</button>
        <button className="button_pers top">Add new transport</button>
        </div>
    </div>
    </>
);
}