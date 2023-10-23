import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
export default function Transport() {
  const navigate = useNavigate();
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [container, setContainer] = useState({
    date_out: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [tableData, setTableData] = useState([]);

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

  const get_inDate = useState(format(new Date(), "yyyy-MM-dd"));

  const selectContainer = (selectedRow) => {
    setContainer({
      id_container: selectedRow.id_container,
      num_container: selectedRow.num_container,
      type: selectedRow.type,
      line: selectedRow.line,
      tare: selectedRow.tare,
      shipment: selectedRow.shipment,
      booking: selectedRow.booking,
      client: selectedRow.client,
      category: selectedRow.category,
      status: selectedRow.status,
      location: selectedRow.location,
      date_in: get_inDate,
    });
  };

  const columns = [
    { name: "Id_container", selector: "id_container" },
    { name: "Number of container", selector: "num_container" },
    { name: "line", selector: "line" },
    { name: "type", selector: "type" },
    { name: "tare", selector: "tare" },
    { name: "shipment", selector: "shipment" },
    { name: "booking", selector: "booking" },
    { name: "client", selector: "client" },
    { name: "category", selector: "category" },
    { name: "status", selector: "status" },
    { name: "location", selector: "location" },
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
      column.selector !== "shipment" &&
      column.selector !== "booking" &&
      column.selector !== "client" &&
      column.selector !== "status" &&
      column.selector !== "location" &&
      column.selector !== "type" &&
      column.selector !== "category" &&
      column.selector !== "tare"
  );

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/container/preAdvice")
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
      .put(
        `http://localhost:8081/container/get_in/${container.id_container}`,
        container
      )
      .then(() => {
        setNotification("Container get in was successfully updated");
        navigate("/getIn");
        setErrors({});
        setLoading(true);
        getContainer();
        setLoading(false);
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
    <div className="card align">
      <div className="card-list-getIn">
        <form onSubmit={onSubmit}>
          <div className="card-getin shadow list">
            <ul>
              <li>
                Container number:
                <label className="info_label">
                  {" "}
                  {container.num_container}{" "}
                </label>
              </li>
              <li>
                Line :<label className="info_label"> {container.line} </label>
              </li>
              <li>
                Shipment :
                <label className="info_label"> {container.shipment} </label>
              </li>
              <li>
                Booking :
                <label className="info_label"> {container.booking} </label>
              </li>
              <li>
                Type :<label className="info_label"> {container.type} </label>
              </li>
              <li>
                Client :
                <label className="info_label"> {container.client} </label>
              </li>
              <li>
                Category :
                <label className="info_label"> {container.category} </label>
              </li>
              <li>
                Status :
                <label className="info_label"> {container.status} </label>
              </li>
              <li>
                Location :
                <label className="info_label"> {container.location} </label>
              </li>
              <li>
                Tare :<label className="info_label"> {container.tare} </label>
              </li>
              <li>
                Gross weight :
                <label className="info_label"> {container.gross_weight} </label>
              </li>
              <li>
                Date in :
                <label className="info_label"> {container.date_in} </label>
              </li>
              <li>
                Position :
                <div className="input-container">
                  <input
                    className="input-field"
                    type="text"
                    value={container.position}
                    onChange={(ev) =>
                      setContainer({
                        ...container,
                        position: ev.target.value,
                      })
                    }
                    placeholder="Position"
                    id="position"
                  />
                  <span className="input-highlight"></span>
                </div>
              </li>
            </ul>
          </div>
          <button className="btn">Save</button>
        </form>
      </div>
      <div className="card">
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
    </div>
  );
}
