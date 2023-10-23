import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";

export default function PreAdvise() {
  const navigate = useNavigate();
  let { id_container } = useParams();
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [container, setContainer] = useState({
    num_container: "",
    line: "",
    shipment: "",
    booking: "",
    type: "",
    category: "",
    status: "",
    tare: "",
    client: "",
    date_pick_up_empty: "",
    date_pick_up_full: "",
    loc_pick_up_empty: "",
    loc_pick_up_full: "",
    loc_stuffing: "",
    date_unstuffing: "",
    date_stuffing: "",
    loc_unstuffing: "",
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
    { name: "Id_container", selector: "id_container" },
    { name: "Number of container", selector: "num_container" },
    { name: "line", selector: "line" },
    { name: "type", selector: "type" },
    { name: "tare", selector: "tare" },
    {
      cell: (row) => (
        <div>
          <button className="button_pers" onClick={() => selectContainer(row)}>
            Select
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter(
    (column) =>
      column.selector !== "id_container" &&
      column.selector !== "line" &&
      column.selector !== "type" &&
      column.selector !== "tare"
  );

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/api/progress_false")
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
      .post("http://localhost:8081/create", container)
      .then(() => {
        setNotification("Container was successfully created");
        navigate("/container");
        setErrors({});
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [line, setLine] = useState("");
  const [loc_pick_up_empty, setLoc_pick_up_empty] = useState("");
  const [loc_pick_up_full, setLoc_pick_up_full] = useState("");
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
  const optionsLocPickUp = [
    { label: "APL", line: "APL" },
    { label: "Bollore", line: "Bollore" },
    { label: "Leong Tananarivo", line: "Leong Tananarivo" },
    { label: "Medlog", line: "Medlog" },
    { label: "MICTSL", line: "MICTSL" },
    { label: "Salone Tananarivo", line: "Salone Tananarivo" },
    { label: "TL", line: "TL" },
  ];

  useEffect(() => {
    getContainer();
  }, []);

  const handleSelectType = (ev) => {
    setType(ev.target.value);
    setContainer((prevContainer) => ({
      ...prevContainer,
      type: ev.target.value,
    }));
  };
  const handleSelectCategory = (ev) => {
    setSelectedCategory(ev.target.value);
    setContainer({ ...container, category: ev.target.value });
  };
  const handleSelectStatus = (ev) => {
    setContainer({ ...container, status: ev.target.value });
    setStatus(ev.target.value);
  };
  const handleSelectLine = (ev) => {
    setContainer({ ...container, line: ev.target.value });
    setLine(ev.target.value);
  };
  const handleSelectLoc_pick_up_empty = (ev) => {
    setContainer({ ...container, loc_pick_up_empty: ev.target.value });
    setLoc_pick_up_empty(ev.target.value);
  };
  const handleSelectLoc_pick_up_full = (ev) => {
    setContainer({ ...container, loc_pick_up_full: ev.target.value });
    setLoc_pick_up_full(ev.target.value);
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

  const [clientInput, setClientInput] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [clientInputClicked, setClientInputClicked] = useState(false);

  const searchClientSuggestions = (inputValue) => {
    axios
      .get(`http://localhost:8081/clients/suggestions?searchTerm=${inputValue}`)
      .then(({ data }) => {
        setClientSuggestions(data);
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching client suggestions:",
          error
        );
      });
  };

  const handleBlur = () => {
    // Use a timeout to delay clearing the suggestions
    setTimeout(() => {
      setClientSuggestions([]);
    }, 200); // 200ms should be enough, but you can adjust this value as needed
  };

  const handleClientInputChange = (ev) => {
    const inputValue = ev.target.value;
    setClientInput(inputValue);

    setClientInputClicked(true);

    searchClientSuggestions(inputValue);
    setContainer({ ...container, client: inputValue });
  };

  const handleClientSelect = (selectedClient) => {
    setClientInput(selectedClient.name);

    setContainer((prevContainer) => ({
      ...prevContainer,
      client: selectedClient.name,
    }));

    setClientSuggestions([]);
  };

  return (
    <div className="overflow-y">
      <h1>Pre-advice</h1>
      <div className="align">
        <div className="card card_width animated fadeInDown">
          <div className="test">
            {loading && <div className="text-center">Loading...</div>}
            {Object.keys(errors).length > 0 && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            {!loading && (
              <form onSubmit={onSubmit}>
                <div className="">
                  <div className="input-container">
                    <label htmlFor="num_container" className="input-label">
                      Number of container
                    </label>
                    <input
                      placeholder="Number of container"
                      className="input-field"
                      type="text"
                      value={container.num_container}
                      onChange={handleNumContainerChange}
                      id="num_container"
                      maxLength="11"
                    />
                    <span className="input-highlight"></span>
                    {numContainerError && (
                      <span className="input-error-message">
                        {numContainerError}
                      </span>
                    )}
                  </div>

                  <div className="input-container">
                    <label htmlFor="line" className="input-label">
                      Line
                    </label>
                    <select
                      className="input-field"
                      value={line}
                      onChange={handleSelectLine}
                      id="line"
                    >
                      <option
                        value=""
                        disabled
                        hidden
                        style={{ color: "gray" }}
                      >
                        Line
                      </option>
                      {optionsLine.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                    <label htmlFor="shipment" className="input-label">
                      Shipment
                    </label>
                    <input
                      placeholder="Shipment"
                      className="input-field"
                      type="text"
                      value={container.shipment}
                      onChange={(ev) =>
                        setContainer({
                          ...container,
                          shipment: ev.target.value,
                        })
                      }
                      id="shipment" // Ajoutez un id unique
                    />
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                    <label htmlFor="booking" className="input-label">
                      Booking
                    </label>
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
                      id="booking"
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>

                <div className="">
                  <div className="input-container">
                    <label htmlFor="type" className="input-label">
                      Type
                    </label>
                    <select
                      className="input-field"
                      value={type}
                      onChange={handleSelectType}
                      id="type"
                    >
                      <option
                        value=""
                        disabled
                        hidden
                        style={{ color: "gray" }}
                      >
                        Type
                      </option>
                      {optionsType.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                    <label htmlFor="category" className="input-label">
                      Category
                    </label>
                    <select
                      className="input-field"
                      value={category}
                      onChange={handleSelectCategory}
                      id="category"
                    >
                      <option
                        value=""
                        disabled
                        hidden
                        style={{ color: "gray" }}
                      >
                        Category
                      </option>
                      {optionsCategory.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-container">
                    <label htmlFor="status" className="input-label">
                      Status
                    </label>
                    <select
                      className="input-field"
                      value={status}
                      onChange={handleSelectStatus}
                      id="status"
                    >
                      <option
                        value=""
                        disabled
                        hidden
                        style={{ color: "gray" }}
                      >
                        Status
                      </option>
                      {optionsStatus.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="input-highlight"></span>
                  </div>
                  <div className="input-container">
                    <label htmlFor="tare" className="input-label">
                      Tare
                    </label>
                    <input
                      placeholder="Tare"
                      className="input-field"
                      type="text"
                      value={container.tare}
                      onChange={(ev) =>
                        setContainer({ ...container, tare: ev.target.value })
                      }
                      id="tare" // Ajoutez un id unique
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>
                {/*****************************************************************************  */}
                {selectedCategory === "Import" && (
                  <>
                    <div className="">
                      <div className="input-container">
                        <label
                          htmlFor="loc_pick_up_full"
                          className="input-label"
                        >
                          Location pick up full
                        </label>
                        <select
                          className="input-field"
                          value={loc_pick_up_full}
                          onChange={handleSelectLoc_pick_up_full}
                          id="loc_pick_up_full"
                        >
                          <option
                            value=""
                            disabled
                            hidden
                            style={{ color: "gray" }}
                          >
                            Location pick up full
                          </option>
                          {optionsLocPickUp.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="input-highlight"></span>
                      </div>
                      <div className="input-container">
                        <label
                          htmlFor="date_pick_up_full"
                          className="input-label"
                        >
                          Wagon Number
                        </label>
                        <input
                          placeholder="pick-up date full"
                          className="input-field"
                          type="date"
                          value={container.date_pick_up_full}
                          onChange={(ev) =>
                            setContainer({
                              ...container,
                              date_pick_up_full: ev.target.value,
                            })
                          }
                          id="date_pick_up_full"
                        />
                        <span className="input-highlight"></span>
                      </div>
                    </div>
                  </>
                )}
                {/**************************************************************************** */}
                {selectedCategory === "Export" && (
                  <>
                    <div className="">
                      <div className="input-container">
                        <label
                          htmlFor="loc_pick_up_empty"
                          className="input-label"
                        >
                          Location pick up empty
                        </label>
                        <select
                          className="input-field"
                          value={loc_pick_up_empty}
                          onChange={handleSelectLoc_pick_up_empty}
                          id="line"
                        >
                          <option
                            value=""
                            disabled
                            hidden
                            style={{ color: "gray" }}
                          >
                            Line
                          </option>
                          {optionsLocPickUp.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="input-highlight"></span>
                      </div>
                      <div className="input-container">
                        <label
                          htmlFor="date_pick_up_empty"
                          className="input-label"
                        >
                          Wagon Number
                        </label>
                        <input
                          placeholder="pick-up date empty"
                          className="input-field"
                          type="date"
                          value={container.date_pick_up_empty}
                          onChange={(ev) =>
                            setContainer({
                              ...container,
                              date_pick_up_empty: ev.target.value,
                            })
                          }
                          id="date_pick_up_empty"
                        />
                        <span className="input-highlight"></span>
                      </div>
                    </div>
                    <div className=""></div>
                  </>
                )}
                {/**************************************************************** */}
                {console.log(container)}

                <div className="input-container">
                  <label htmlFor="client" className="input-label">
                    Client
                  </label>
                  <input
                    placeholder="Client"
                    className="input-field"
                    type="text"
                    value={clientInput}
                    onChange={handleClientInputChange}
                    onBlur={handleBlur}
                    autocomplete="off"
                    id="client"
                  />
                  <span className="input-highlight"></span>
                </div>
                {/* Display client suggestions */}
                {clientSuggestions.length > 0 && (
                  <ul className="client-suggestions">
                    {clientSuggestions.map((client) => (
                      <li
                        key={client.id}
                        className="client-suggestion-item"
                        onClick={() => handleClientSelect(client)}
                      >
                        {client.name}
                      </li>
                    ))}
                  </ul>
                )}

                <div className=""></div>
                <button className="btn">Save</button>
              </form>
            )}
          </div>
        </div>
        <div className="card card_width">
          <div className="form_search_new">
            <input
              className="input"
              placeholder="Type your text"
              required=""
              type="text"
            />
            <span className="input-border"></span>
          </div>
          <DataTable
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
          />
        </div>
        <div className="card card_width">
          <button
            className="button_pers"
            onClick={() => {
              setModalOpen(true); // Set the id of the clicked row
            }}
          >
            Add new client
          </button>
        </div>
      </div>
    </div>
  );
}
