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
    });
    setType(selectedRow.type);
    setLine(selectedRow.line);
};

const columns = [
    { name: "Id_container", selector: "id_container"},
    { name: "Number of container", selector: "num_container" },
    { name: "line", selector: "line" },
    { name: "type", selector: "type" },
    { name: "tare", selector: "tare" },
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
    (column) => column.selector !== 'id_container' && column.selector !== 'line' && column.selector !== 'type' && column.selector !== 'tare');

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

const getTransport = () => {
    setLoading(true);
    axios
    .get("http://localhost:8081/transport")
    .then(({ data }) => {
    setLoading(false);
    const mappedOptions = data.map((item) => ({
        label: item.company,
        value: item.id_transport,
    }));
    setOptionsTransport(mappedOptions);
    })
    .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
    });
};


const getTp = () => {
    setLoading(true);
    axios
    .get("http://localhost:8081/tp")
    .then(({ data }) => {
    setLoading(false);
    const mappedOptionsTp = data.map((tp) => ({
        label: tp.code_location_tp +" - "+ tp.location,
        value: tp.id_tp,
    }));
    setOptionsTp(mappedOptionsTp);
    })
    .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
    });
};

useEffect(() => {
    getContainer();
    getTransport();
    getTp();
}, []);

const [numContainerError, setNumContainerError] = useState("");

const handleNumContainerChange = (ev) => {
    let inputValue = ev.target.value;
    
    if (inputValue.length > 11) {
    inputValue = inputValue.slice(0, 11);
    }
    
    if (inputValue.length !== 11) {
    setNumContainerError("Must be 11 characters long.");
    } else if (!/^[A-Za-z]{4}\d{7}$/.test(inputValue)) {
    setNumContainerError("Must begin with 4 letters followed by 7 digits.");
    } else {
    setNumContainerError("");
    }
    setContainer({ ...container, num_container: ev.target.value });
};

const handleBlur = () => {
// Use a timeout to delay clearing the suggestions
setTimeout(() => {
    setClientSuggestions([]);
}, 200); // 200ms should be enough, but you can adjust this value as needed
};

const handleClientSelect = (selectedClient) => { 
setClientInput(selectedClient.name);

setContainer(prevContainer => ({
    ...prevContainer,
    client: selectedClient.name
}));

setClientSuggestions([]);
};


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
                    <li>Release date: 
                        <label className="info_label"> {container.date_in} </label>
                    </li>
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