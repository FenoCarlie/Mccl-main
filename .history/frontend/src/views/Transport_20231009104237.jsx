import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";
import Stepper from "react-stepper-horizontal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruck,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Transport() {
  const navigate = useNavigate();
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [container, setContainer] = useState({
    location: "",
  });
  const [currentStep, setCurrentStep] = useState(-1);

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

    // Activez la première étape lorsque l'utilisateur sélectionne un conteneur
    setCurrentStep(0);
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
      <div className="align">
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
              <div className="step-container">
                {currentStep === -1 ? (
                  <div className="center">
                    <h1>please select a container</h1>
                  </div>
                ) : currentStep === 0 ? (
                  <div>
                    <div className="header align">
                      <FontAwesomeIcon icon={faMapMarkerAlt} size="4x" />
                      <h1>{container.num_container}</h1>
                    </div>
                  </div>
                ) : currentStep === 1 ? (
                  <div>
                    <div className="header align">
                      <FontAwesomeIcon icon={faTruck} size="4x" />
                      <h1>transport</h1>
                    </div>
                  </div>
                ) : currentStep === 2 ? (
                  <div>
                    <div className="header align">
                      <FontAwesomeIcon icon={faCheckCircle} size="4x" />
                      <h1>validation</h1>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="button_step">
                {currentStep >= 0 && currentStep < 2 && (
                  <div className="step-buttons">
                    {currentStep === 0 ? null : (
                      <button onClick={() => setCurrentStep(currentStep - 1)}>
                        <span className="previous">previous</span>
                      </button>
                    )}
                    <button onClick={() => setCurrentStep(currentStep + 1)}>
                      <span className="next">Next</span>
                    </button>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="step-buttons">
                    <button onClick={() => setCurrentStep(currentStep - 1)}>
                      <span className="previous">previous</span>
                    </button>
                    <button onClick={() => onSubmit()}>validate</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="transport_step_footer">
            {currentStep >= 0 && (
              <Stepper
                steps={[
                  {
                    title: "location",
                    icon: <FontAwesomeIcon icon={faMapMarkerAlt} />,
                  },
                  {
                    title: "transport",
                    icon: <FontAwesomeIcon icon={faTruck} />,
                  },
                  {
                    title: "validation",
                    icon: <FontAwesomeIcon icon={faCheckCircle} />,
                  },
                ]}
                activeStep={currentStep}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
