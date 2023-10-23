import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";

export default function GetIn() {
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
    { name: "Id_container", selector: "id_container" },
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
      column.selector !== "gross_weight" &&
      column.selector !== "client" &&
      column.selector !== "date_in" &&
      column.selector !== "status" &&
      column.selector !== "location" &&
      column.selector !== "position" &&
      column.selector !== "type" &&
      column.selector !== "category" &&
      column.selector !== "tare"
  );

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
      .put(
        `http://localhost:8081/container/get_out/${container.id_container}`,
        container
      )
      .then(() => {
        setNotification("Container get out was successfully updated");
        navigate("/container/getOut");
        setErrors({});
        setLoading(true);
        getContainer(); // Fetch the latest data
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
      <div className="card-getin">
        <div className="card-img-getin"></div>
        <div className="card-info-getin">
          <div className="card-getin-container"></div>
          <div className="card-getin-footer">
            <button className="card-icon-getin">
              <div className="card-text-getin">
                <p className="text-subtitle-getin">Get in</p>
              </div>
              <svg className="icon-getin" viewBox="0 0 28 25">
                <path d="M13.145 2.13l1.94-1.867 12.178 12-12.178 12-1.94-1.867 8.931-8.8H.737V10.93h21.339z"></path>
              </svg>
            </button>
          </div>
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
    </div>
  );
}
