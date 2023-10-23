  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from 'axios';
  import { useStateContext } from "../context/ContextProvider.jsx";
  import DataTable from "react-data-table-component";

  export default function ContainerForm() {
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
      tare:"",
      gross_weight:"",
      weight_cum:"",
      weight_dep:"",
      date_in:"",
      date_out:""
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
      });
    };
    
    const columns = [
      { name: "Id_container", selector: "id_container"},
      { name: "Number of container", selector: "num_container" },
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

    const columnsToDisplay = columns.filter((column) => column.selector !== 'id_container');

    const getContainer = () => {
      setLoading(true);
      axios
        .get("http://localhost:8081/")
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
  
    useEffect(() => {
      getContainer();
    }, []);

    useEffect(() => {
      console.log(container);
    }, [container]);

    const onSubmit = (ev) => {
      ev.preventDefault();
      axios
        .post('http://localhost:8081/create', container)
        .then(() => {
          setNotification('Container was successfully created');
          navigate('/container');
          setErrors({}); // Réinitialiser les erreurs en cas de succès
        })
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            setErrors(err.response.data.errors);
          }
        });
    };

    const [type, setType] = useState('')
    const [category, setCategory] = useState('')
    const [status, setStatus] = useState('')
    const [line, setLine] = useState('')
    const [typeTransport, setTypeTransport] = useState("");
    const [id_transport, setId_transport] = useState("");
    const [id_tp, setId_tp] = useState("");
    const optionsType = [
      { label: "20' Dry Standard", type: "20' Dry Standard" },
      { label: "20' Dry ventilé", type: "20' Dry ventilé" },
      { label: "20' Open Top", type: "20' Open Top" },
      { label: "20' Flat Rack", type: "20' Flat Rack" },
      { label: "20' Reefer", type: "20' Reefer" },
      { label: "20' Tank", type: "20' Tank" },
      { label: "20' Open Side", type: "20' Open Side" },
      { label: "40' Dry Standard", type: "40' Dry Standard" },
      { label: "40' High Cube (HC)", type: "40' High Cube (HC)" },
      { label: "40' Dry ventilé", type: "40' Dry ventilé" },
      { label: "40' Open Top", type: "40' Open Top" },
      { label: "40' Flat Rack", type: "40' Flat Rack" },
      { label: "40' Reefer", type: "40' Reefer" },
      { label: "40' Tank", type: "40' Tank" },
      { label: "40' Open Side", type: "40' Open Side" },
      { label: "40' Double Door", type: "40' Double Door" },
      { label: "40' High Cube Palletwide", type: "40' High Cube Palletwide" },
      { label: "40' Open Top Hard Top", type: "40' Open Top Hard Top" },
    ];
    const optionsCategory = [
      { label: "Import", category: "Import" },
      { label: "Export", category: "Export" },
    ];
    const optionsStatus = [
      { label: "Full", status: "Full" },
      { label: "Empty", status: "Empty" },
    ];
    const optionsTypeTransport = [
      { label: "Truck", typeTransport: "Truck" },
      { label: "Rail", typeTransport: "Rail" },
    ];
    const optionsLine = [
      { label: "APL", line: "APL" },
      { label: "CMA CGM ", line: "CMA CGM " },
      { label: "Cosco Shipping Lines ", line: "Cosco Shipping Lines " },
      { label: "Evergreen Line ", line: "Evergreen Line " },
      { label: "GL", line: "GL" },
      { label: "Hamburg Süd", line: "Hamburg Süd" },
      { label: "LA SEAL", line: "LA SEAL" },
      { label: "Maersk Line ", line: "Maersk Line " },
      { label: "MSC", line: "MSC" },
      { label: "PIL", line: "PIL" },
    ];

    const [optionsTransport, setOptionsTransport] = useState([]);

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
  
    useEffect(() => {
      getTransport();
    }, []);

    const [optionsTp, setOptionsTp] = useState([]);

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
      getTp();
    }, []);

    const handleSelectType = (ev) => {
      setType(ev.target.value);
      setContainer((prevContainer) => ({
        ...prevContainer,
        type: ev.target.value,
      }));
    };
    const handleSelectCategory = (ev) => {
      setContainer({ ...container, category: ev.target.value });
      setCategory(ev.target.value);
    };
    const handleSelectStatus = (ev) => {
      setContainer({ ...container, status: ev.target.value });
      setStatus(ev.target.value);
    };
    const handleSelectLine = (ev) => {
      setContainer({ ...container, line: ev.target.value });
      setLine(ev.target.value);
    };
    const handleSelectTransport = (ev) => {
      setContainer({ ...container, id_transport: ev.target.value });
      setId_transport(ev.target.value);
    };
    const handleSelectTp = (ev) => {
      setContainer({ ...container, id_tp: ev.target.value });
      setId_tp(ev.target.value);
    };
    const handleSelectTypeTransport = (ev) => {
      setSelectedTransport(ev.target.value);
      setTypeTransport(ev.target.value);
    };
    
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


    return (
      <>
        <h1>New Container</h1>
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
                  <div className="input-container">
                  <input
                    placeholder="Number of container"
                    className="input-field"
                    type="text"
                    value={container.num_container}
                    onChange={handleNumContainerChange}
                    id="num_container"
                    maxLength="11"
                  />
                  <label htmlFor="num_container" className="input-label">
                    Number of container
                  </label>
                      <span className="input-highlight"></span>
                      {numContainerError && (
                        <span className="input-error-message">{numContainerError}</span> )}
                  </div>

                  <div className="input-container">
                  <select
                    className="input-field"
                    value={line}
                    onChange={handleSelectLine}
                    id="line"
                  >
                    <option value="" disabled hidden style={{ color: 'gray' }}>
                      Line
                    </option>
                    {optionsLine.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="line" className="input-label">
                    Line
                  </label>
                    <span className="input-highlight"></span>
                  </div>
                  
                  <div className="input-container">
                  <input
                      placeholder="Shipment"
                      className="input-field"
                      type="text"
                      value={container.shipment}
                      onChange={(ev) => setContainer({ ...container, shipment: ev.target.value })}
                      id="shipment" // Ajoutez un id unique
                    />
                    <label htmlFor="shipment" className="input-label">
                      Shipment
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <input
                      placeholder="Booking"
                      className="input-field"
                      type="text"
                      value={container.booking}
                      onChange={(ev) => {
                        const newValue = ev.target.value.slice(0, 9);
                        setContainer({ ...container, booking: newValue });
                      }}
                      maxLength="9"
                      id="booking" // Ajoutez un id unique
                    />
                    <label htmlFor="booking" className="input-label">
                      Booking
                    </label>
                    <span className="input-highlight"></span>
                  </div>
                </div>

                <div className="align">
                  <div className="input-container">
                  <select
                      className="input-field"
                      value={type}
                      onChange={handleSelectType}
                      id="type" // Ajoutez un id unique
                    >
                      <option value="" disabled hidden style={{ color: 'gray' }}>
                        Type
                      </option>
                      {optionsType.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="type" className="input-label">
                      Type
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <select
                      className="input-field"
                      value={typeTransport}
                      onChange={handleSelectTypeTransport}
                      id="transport" // Ajoutez un id unique
                    >
                      <option value="" disabled hidden style={{ color: 'gray' }}>
                        Transport
                      </option>
                      {optionsTypeTransport.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="transport" className="input-label">
                      Transport
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <select
                      className="input-field"
                      value={category}
                      onChange={handleSelectCategory}
                      id="category" // Ajoutez un id unique
                    >
                      <option value="" disabled hidden style={{ color: 'gray' }}>
                        Category
                      </option>
                      {optionsCategory.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="category" className="input-label">
                      Category
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <select
                    className="input-field"
                    value={status}
                    onChange={handleSelectStatus}
                    id="status" // Ajoutez un id unique
                  >
                    <option value="" disabled hidden style={{ color: 'gray' }}>
                      Status
                    </option>
                    {optionsStatus.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="status" className="input-label">
                    Status
                  </label>
                    <span className="input-highlight"></span>
                  </div>
                  <div className="input-container">
                  <select
                    className="input-field"
                    value={id_tp}
                    onChange={handleSelectTp}
                    id="id_tp" // Ajoutez un id unique
                  >
                    <option value="" disabled hidden style={{ color: 'gray' }}>
                      Code location T.P
                    </option>
                    {optionsTp.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="id_tp" className="input-label">
                    Code location T.P
                  </label>
                    <span className="input-highlight"></span>
                  </div>
                </div>

                {selectedTransport === 'Truck' && (
                  <div className="align">
                    <div className="input-container">
                      <select className="input-field" value={id_transport} onChange={handleSelectTransport} > 
                        <option value="" disabled hidden style={{ color: 'gray' }} > Transport company </option>
                        {optionsTransport.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="transport" className="input-label"> Transport </label>
                      <span className="input-highlight"></span>
                    </div>
                    <div className="input-container">
                    <input
                      placeholder="Truck Number"
                      className="input-field"
                      type="text"
                      value={container.num_truck}
                      onChange={(ev) => setContainer({ ...container, num_truck: ev.target.value })}
                      id="num_truck" // Ajoutez un id unique
                    />
                    <label htmlFor="num_truck" className="input-label">
                      Truck Number
                    </label>
                      <span className="input-highlight"></span>
                    </div>
                  </div>
                )}

                {selectedTransport === 'Rail' && (
                  <div className="align">
                    <div className="input-container">
                      <select className="input-field" value={id_transport} onChange={handleSelectTransport} > 
                        <option value="" disabled hidden style={{ color: 'gray' }} > Transport company </option>
                        {optionsTransport.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="transport" className="input-label"> Transport </label>
                      <span className="input-highlight"></span>
                    </div>
                    <div className="input-container">
                    <input
                      placeholder="Wagon Number"
                      className="input-field"
                      type="text"
                      value={container.num_wagon}
                      onChange={(ev) => setContainer({ ...container, num_wagon: ev.target.value })}
                      id="num_wagon" // Ajoutez un id unique
                    />
                    <label htmlFor="num_wagon" className="input-label">
                      Wagon Number
                    </label>
                      <span className="input-highlight"></span>
                    </div>
                  </div>
                )}

                <div className="align">
                  <div className="input-container">
                  <input
                      placeholder="Tare"
                      className="input-field"
                      type="text"
                      value={container.tare}
                      onChange={(ev) => setContainer({ ...container, tare: ev.target.value })}
                      id="tare" // Ajoutez un id unique
                    />
                    <label htmlFor="tare" className="input-label">
                      Tare
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                    <input
                      placeholder="Gross Weight"
                      className="input-field"
                      type="text"
                      value={container.gross_weight}
                      onChange={(ev) => setContainer({ ...container, gross_weight: ev.target.value })}
                      id="gross_weight" // Ajoutez un id unique
                    />
                    <label htmlFor="gross_weight" className="input-label">
                      Gross Weight
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <input
                      placeholder="Weight cum"
                      className="input-field"
                      type="text"
                      value={container.weight_cum}
                      onChange={(ev) => setContainer({ ...container, weight_cum: ev.target.value })}
                      id="weight_cum" // Ajoutez un id unique
                    />
                    <label htmlFor="weight_cum" className="input-label">
                      Weight Cum
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                  <input
                    placeholder="Weight Departure"
                    className="input-field"
                    type="text"
                    value={container.weight_dep}
                    onChange={(ev) => setContainer({ ...container, weight_dep: ev.target.value })}
                    id="weight_dep" // Ajoutez un id unique
                  />
                  <label htmlFor="weight_dep" className="input-label">
                    Weight Departure
                  </label>
                    <span className="input-highlight"></span>
                  </div>
                </div>
                
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
                  
                  <div className="input-container">
                    <input className="input-field" type="date" value={container.date_out} onChange={(ev) =>
                        setContainer({ ...container, date_out: ev.target.value })
                      }
                      placeholder="Date out"
                    />
                    <label htmlFor="date_out" className="input-label">
                      Date out
                    </label>
                    <span className="input-highlight"></span>
                  </div>

                <div className="align">
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