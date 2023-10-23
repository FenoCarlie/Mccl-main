  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from 'axios';
  import { useStateContext } from "../context/ContextProvider.jsx";
  import DataTable from "react-data-table-component";

  export default function ContainerForm() {
    const navigate = useNavigate();
    let { id_container } = useParams();
    const [filteredContainer, setFilteredContainer] = useState([]);
    const [id_get, setSelectedId] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [container, setContainer] = useState({
      id_container: null,
      num_container: "",
      name_container: "",
      type: "",
      category: "",
      status: "",
      live: "",
      code_location_tp: "",
      tp_name: "",
      position: "",
      date_departure: "",
      date_arrived: "",
      tare: "",
      gross_weight: "",
      weight_cum: "",
      weight_dep: "",
      transit_time: "",
      shipment: "",
      date_in: '',
      date_out: ''
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
      if (id_container) {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${id_container}`)
          .then(({ data }) => {
            setLoading(false);
            setContainer(data[0]);
            console.log(data);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }, [id_container]);

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

    const putContainerUsed = (row) => {
      setSelectedRow(row);
    }
    
    const columns = [
      { name: "Id_container", selector: "id_container"},
      { name: "Number of container", selector: "num_container" },
      {
        cell: (row) => (
          <div>
            <button
                className="button_pers"
                onClick={() => putContainerUsed(row)}
              >
                Selected
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
      if (id_container) {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${id_container}`)
          .then(({ data }) => {
            setLoading(false);
            setContainer(data);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setContainer({
          id_container: null,
          num_container: "",
          name_container: "",
          type: "",
          category: "",
          status: "",
          live: "",
          id_tp: "",
          position: "",
          date_departure: "",
          date_arrived: "",
          tare: "",
          gross_weight: "",
          weight_cum: "",
          weight_dep: "",
          shipment: "",
          date_in: '',
          date_out: ''
        });
      }
    }, [id_container]);

    useEffect(() => {
      console.log(container); // Log the updated container value here
    }, [container]);

    const onSubmit = ev => {
      ev.preventDefault();
      if (container.id_container) {
        axios
          .post('http://localhost:8081/create', container)
          .then(() => {
            setNotification('Container was successfully created');
            navigate('/container');
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
          });
      } else {
        axios
          .post('http://localhost:8081/create', container)
          .then(() => {
            setNotification('Container was successfully created');
            navigate('/container');
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
          });
      }
    };

    const [type, setType] = useState('')
    const optionsType = [
      { label: "20' Dry Van", type: "20' Dry Van" },
      { label: "20' Open Top", type: "20' Open Top" },
      { label: "20' Flat Rack", type: "20' Flat Rack" },
      { label: "20' Reefer", type: "20' Reefer" },
      { label: "20' Tank", type: "20' Tank" },
      { label: "20' Open Side", type: "20' Open Side" },
      { label: "40' Dry Van", type: "40' Dry Van" },
      { label: "40' High Cube (HC)", type: "40' High Cube (HC)" },
      { label: "40' Open Top", type: "40' Open Top" },
      { label: "40' Flat Rack", type: "40' Flat Rack" },
      { label: "40' Reefer", type: "40' Reefer" },
      { label: "40' Tank", type: "40' Tank" },
      { label: "40' Open Side", type: "40' Open Side" },
      { label: "40' Double Door", type: "40' Double Door" },
      { label: "40' High Cube Palletwide", type: "40' High Cube Palletwide" },
      { label: "40' Open Top Hard Top", type: "40' Open Top Hard Top" },
    ];
    

    const handleSelectType = (ev) => {
      setContainer({ ...container, type: ev.target.value });
      setType(ev.target.value);
    };

    return (
      <>
        <h1>{container.id_container ? `Update container: ${container.num_container}` : 'New Container'}</h1>
        <div className="align">
        <div className="card card_width animated fadeInDown">
          <div className="test">
          {loading && (
            <div className="text-center">
              Loading...
            </div>
          )}
          {errors && (
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
            <input placeholder="Number of container" className="input-field" type="text" value={selectedRow ? selectedRow.num_container : ""} onChange={(ev) =>
                setContainer({ ...container, num_container: ev.target.value })
              }
            />
            <label htmlFor="num_container" className="input-label">
              Number of container
            </label>
            <span className="input-highlight"></span>
          </div>

            <div className="input-container">
              <input placeholder="Name of container" className="input-field" type="text" value={container.name_container} onChange={(ev) =>
                  setContainer({ ...container, name_container: ev.target.value })
                }
              />
              <label htmlFor="name_container" className="input-label">
                Name of container
              </label>
              <span className="input-highlight"></span>
            </div>
            <div className="input-container">
            <input placeholder="Shipment" className="input-field" type="text" value={container.shipment}
              onChange={(ev) => setContainer({ ...container, shipment: ev.target.value })}
            />
            <label htmlFor="shipment" className="input-label">
              Shipment
            </label>
            <span className="input-highlight"></span>
          </div>
          </div>

          <div className="align">
              <div className="input-container">
                <select className="input-field" value={type} onChange={handleSelectType} > 
                  <option value="" disabled hidden style={{ color: 'gray' }} > Type </option>
                  {optionsType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              <label htmlFor="type" className="input-label"> Type </label>
              <span className="input-highlight"></span>
            </div>

            <div className="input-container">
              <input placeholder="Category" className="input-field" type="text" value={container.category} onChange={(ev) =>
                  setContainer({ ...container, category: ev.target.value })
                }
              />
              <label htmlFor="category" className="input-label">
                Category
              </label>
              <span className="input-highlight"></span>
            </div>
          </div>
          <div className="align">
          <div className="input-container">
            <input placeholder="Status" className="input-field" type="text" value={container.status}
              onChange={(ev) => setContainer({ ...container, status: ev.target.value })}
            />
            <label htmlFor="status" className="input-label">
              Status
            </label>
            <span className="input-highlight"></span>
          </div>

          <div className="input-container">
            <input placeholder="Line" className="input-field" type="text" value={container.line}
              onChange={(ev) => setContainer({ ...container, line: ev.target.value })}
            />
            <label htmlFor="line" className="input-label">
              Live
            </label>
            <span className="input-highlight"></span>
          </div>
          </div>

<div className="input-container">
  <input placeholder="Location T.P" className="input-field" type="text" value={container.id_tp}
    onChange={(ev) =>
      setContainer({ ...container, id_tp: ev.target.value })
    }
  />
  <label htmlFor="id_tp" className="input-label">
    Code of location T.P
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>

    <div className="align">
    <div className="input-container">
  <input placeholder="Tare" className="input-field" type="text" value={container.tare}
    onChange={(ev) => setContainer({ ...container, tare: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Tare
  </label>
  <span className="input-highlight"></span>
</div>
    <div className="input-container">
  <input placeholder="Gross weight" className="input-field" type="text" value={container.gross_weight}
    onChange={(ev) => setContainer({ ...container, gross_weight: ev.target.value })}
  />
  <label htmlFor="gross_weight" className="input-label">
    Gross weight
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Weight in cum" className="input-field" type="text" value={container.weight_cum}
    onChange={(ev) => setContainer({ ...container, weight_cum: ev.target.value })}
  />
  <label htmlFor="weight_cum" className="input-label">
    Weight in cum
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="weight departure" className="input-field" type="text" value={container.weight_dep}
    onChange={(ev) => setContainer({ ...container, weight_dep: ev.target.value })}
  />
  <label htmlFor="weight_dep" className="input-label">
    weight departure
  </label>
  <span className="input-highlight"></span>
</div>
    </div>

    <div className="align">
      <div className="input-container">
        <input className="input-field" type="date" value={container.date_in} onChange={(ev) => setContainer({ ...container, date_in: ev.target.value })}
          placeholder="Date in"
        />
        <label htmlFor="date_in" className="input-label">
          Date in
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
      <div className="input-container">
      <input className="input-field" type="date" value={container.date_in} onChange={(ev) => setContainer({ ...container, date_in: ev.target.value })}
        placeholder="Date in"
      />
      <label htmlFor="date_in" className="input-label">
        Date in
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
    </div>

    <div className="align">
    </div>
              <button className="btn">Save</button>
            </form>
          )}
          </div>
        </div>
        <div className="card">
        <div className="form_search_new">
        <input className="input" placeholder="Type your text" required="" type="text"/>
        <span className="input-border"></span>
      </div>
        <DataTable
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
          />
          {console.log('id in form' + id_get)}
        </div>
        <div className="card">
          <button onClick={() => {
                setModalOpen(true); // Set the id of the clicked row
              }}>Add new client</button>
          <button>Add new transport</button>
        </div>
        </div>
      </>
    );
  }