import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";
import Stepper from "react-stepper-horizontal";

export default function Transport() {
  const navigate = useNavigate();
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [tableData, setTableData] = useState([]);
  const [container, setContainer] = useState({
    date_pick_up_empty: "",
    date_pick_up_full: "",
    loc_pick_up_empty: "",
    loc_pick_up_full: "",
    loc_stuffing: "",
    date_unstuffing: "",
    date_stuffing: "",
    loc_unstuffing: "",
  });

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

  const optionsLocPickUp = [
    { label: "APL", line: "APL" },
    { label: "Bollore", line: "Bollore" },
    { label: "Leong Tananarivo", line: "Leong Tananarivo" },
    { label: "Medlog", line: "Medlog" },
    { label: "MICTSL", line: "MICTSL" },
    { label: "Salone Tananarivo", line: "Salone Tananarivo" },
    { label: "TL", line: "TL" },
  ];

  const handleSelectCategory = (ev) => {
    setSelectedCategory(ev.target.value);
    setContainer({ ...container, category: ev.target.value });
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
          <div className="transport_step_container cookie-card">
            <h1 className="tittle">{container.num_container}</h1>
            <div className="step description">
              <div className="step-container">
                {currentStep === -1 ? (
                  <div className="step-1">
                    <h1>Please select a container</h1>
                    <div className="center">
                      <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                      </div>
                    </div>
                  </div>
                ) : currentStep === 0 ? (
                  <>
                    <h3>location</h3>
                    {selectedCategory === "Import" && (
                      <>
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
                      </>
                    )}
                    {selectedCategory === "Export" && <></>}
                  </>
                ) : currentStep === 1 ? (
                  <>
                    <h3>transport</h3>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <h3>validation</h3>
                  </>
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
                  { title: "location" },
                  { title: "transport" },
                  { title: "validation" },
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
