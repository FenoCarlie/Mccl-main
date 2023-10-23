import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";
import Stepper from "react-stepper-horizontal";
export default function Transport() {
  const navigate = useNavigate();
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [container, setContainer] = useState({
    location: "",
  });
  const [currentStep, setCurrentStep] = useState(0);

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
      shipment: selectedRow.shipment,
      booking: selectedRow.booking,
      category: selectedRow.category,
    });
  };

  const columns = [
    { name: "Id_container", selector: "id_container" },
    { name: "Number of container", selector: "num_container" },
    { name: "shipment", selector: "shipment" },
    { name: "booking", selector: "booking" },
    { name: "category", selector: "category" },
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
      column.selector !== "shipment" &&
      column.selector !== "booking" &&
      column.selector !== "category"
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
      <div className="card align">
        <div className="">
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
        <div className="transport_step">
          <div className="transport_step_container card">
            <div className="step">
              <h1>location</h1>
              {/* Bouton pour passer à l'étape suivante */}
              <button onClick={() => setCurrentStep(currentStep + 1)}>
                next
              </button>
            </div>
            <div className="step">
              <h1>transport</h1>
              {/* Bouton pour revenir à l'étape précédente */}
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                previous
              </button>
              {/* Bouton pour passer à l'étape suivante */}
              <button onClick={() => setCurrentStep(currentStep + 1)}>
                next
              </button>
            </div>
            <div className="step">
              <h1>validation</h1>
              {/* Bouton pour revenir à l'étape précédente */}
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                previous
              </button>
              {/* Bouton pour valider l'étape */}
              <button onClick={() => handleValidation()}>validate</button>
            </div>
          </div>
          <div className="transport_step_footer">
            {/* Utilisez également currentStep pour activer l'étape actuelle */}
            <Stepper
              steps={[
                { title: "location" },
                { title: "transport" },
                { title: "validation" },
              ]}
              activeStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
