import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";

export default function Client() {
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [id_get, setSelectedId] = useState(null);
  const [filteredClient, setFilteredClient] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const columns = [
    { name: "Id", selector: "id" },
    { name: "Nom", selector: "nom" },
    { name: "Client", selector: "client" },
    { name: "Type", selector: "type" },
    { name: "Category", selector: "category" },
    { name: "Status", selector: "status" },
    { name: "Line", selector: "line" },
    { name: "Booking", selector: "booking" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              setSelectedId(row.id); // Set the id of the clicked row
            }}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");
  useEffect(() => {
    const handleFilter = () => {
      const filteredData = client.filter((item) => {
        return (
          item.nom?.includes(searchQuery) || item.adresse?.includes(searchQuery)
        );
      });
      setFilteredClient(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, client]);
  useEffect(() => {}, []);

  console.log(id_get);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Container</h1>
        <Link className="btn-add" to="/client/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        {loading && <></>}
        {!loading && (
          <DataTable
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
            pagination
          />
        )}
      </div>
    </div>
  );
}
