import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";
import { iconsImgs } from "../icon/icone";

export default function Container() {
  const [conteneurs, setConteneurs] = useState([]);
  const [filteredConteneur, setFilteredConteneur] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [id_get, setSelectedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalClientOpen, setIsModalClientOpen] = useState(false);
  const [conteneur, setConteneur] = useState({
    projet_id: "",
    num_conteneur: "",
    line: "",
    type: "",
    tare: "",
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

  const columns = [
    { name: "id", selector: "id" },
    { name: "Numero conteneur", selector: "num_conteneur" },
    { name: "Tare", selector: "tare" },
    { name: "Line", selector: "line" },
    { name: "Type", selector: "type" },
    {
      cell: (row) => (
        <div>
          <Link
            className="openModalBtn button_pers"
            to={`/container/infoConteneur/${row.id}`}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </Link>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081//conteneur")
      .then(({ data }) => {
        setLoading(false);
        setConteneurs(data);
        setFilteredConteneur(data);
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
      const filteredData = conteneurs.filter((item) => {
        return (
          item.conteneur?.includes(searchQuery) ||
          item.type?.includes(searchQuery) ||
          item.tare?.includes(searchQuery) ||
          item.line?.includes(searchQuery)
        );
      });
      setFilteredConteneur(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, conteneurs]);

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
          <h1>Conteneur</h1>

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
              <button
                className="btn-add"
                onClick={() => {
                  setIsModalConteneurOpen(true);
                }}
              >
                Nouveau Conteneur
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="card animated fadeInDown .table-container ">
            <DataTable
              columns={columnsToDisplay}
              data={filteredConteneur}
              customStyles={customStyles}
              pagination
            />
          </div>
        </div>
      </div>
    </div>
  );
}
