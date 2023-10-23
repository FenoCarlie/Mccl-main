import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";
import { iconsImgs } from "../icon/icone";

export default function Container() {
  const [container, setContainer] = useState([]);
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [id_get, setSelectedId] = useState(null);

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
    { name: "Id_container", selector: "id_container" },
    { name: "Number of container", selector: "num_container" },
    { name: "Client", selector: "client" },
    { name: "Projet", selector: "client" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              setModalOpen(true);
              setSelectedId(row.id_container); // Set the id of the clicked row
            }}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter(
    (column) => column.selector !== "id_container"
  );

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/container/in_progress-last")
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

  // Fonction pour mettre à jour les données des conteneurs après la suppression
  const updateContainerData = () => {
    getContainer();
  };

  useEffect(() => {
    updateContainerData();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = container.filter((item) => {
        return (
          item.num_container?.includes(searchQuery) ||
          item.nom?.includes(searchQuery) ||
          item.nom_projet?.includes(searchQuery)
        );
      });
      setFilteredContainer(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, container]);

  return (
    <div>
      <div style={{ maxHeight: "900px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Container</h1>

          <div className="action">
            <div className="align">
              <label className="search-box">
                <button className="btn-search">
                  <img className="info_icon" src={iconsImgs.loupe} alt="" />
                </button>
                <input
                  type="text"
                  className="input-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to Search..."
                />
              </label>
            </div>
          </div>
        </div>
        <div className="card animated fadeInDown .table-container ">
          <DataTable
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
            pagination
          />
        </div>
        <div className="card animated fadeInDown">
          {loading && <div className="text-center">Loading...</div>}
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          {!loading && (
            <div className="list">
              <ul>
                <li>
                  Shipment:
                  <label className="info_label">{container.shipment}</label>
                </li>
                <li>
                  Booking:
                  <label className="info_label">{container.booking}</label>
                </li>
                <li>
                  Type:
                  <label className="info_label">{container.type}</label>
                </li>
                <li>
                  Line:
                  <label className="info_label">{container.line}</label>
                </li>
                <li>
                  Client:
                  <label className="info_label">{container.client}</label>
                </li>
                <li>
                  Transport:
                  <label className="info_label">{container.company}</label>
                </li>
                <li>
                  Truck number:
                  <label className="info_label">{container.num_truck}</label>
                </li>
                <li>
                  Category:
                  <label className="info_label">{container.category}</label>
                </li>
                <li>
                  Status:
                  <label className="info_label">{container.status}</label>
                </li>
                <li>
                  Location:
                  <label className="info_label">{container.location}</label>
                </li>
                <li>
                  Position:
                  <label className="info_label">{container.position}</label>
                </li>
                <li>
                  Gross weight:
                  <label className="info_label">{container.gross_weight}</label>
                </li>
                <li>
                  Tare:
                  <label className="info_label">{container.tare}</label>
                </li>
                <li>
                  Release date:
                  <label className="info_label">{container.date_cum}</label>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
