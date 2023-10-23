import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";

export default function GetOut() {
  const { setNotification } = useStateContext();
  const [tableData, setTableData] = useState([]);
  const [container, setContainer] = useState({
    date_out: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContainer();
  }, []);

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/container/in_progress")
      .then(({ data }) => {
        setLoading(false);
        setTableData(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .put(`http://localhost:8081/container/get_out/${container.id_container}`, container)
      .then(() => {
        setNotification("Container get out was successfully updated");
        // Clear errors and update tableData here if necessary
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <>
      <h1>Get out Container</h1>
      {/* Votre JSX existant ... */}
      {Object.keys(errors).length > 0 && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      {/* Votre JSX existant ... */}
    </>
  );
}
