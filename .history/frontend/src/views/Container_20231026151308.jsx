import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";
import { iconsImgs } from "../icon/icone";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Container() {
  const [conteneurs, setConteneurs] = useState([]);
  const [projet, setProjet] = useState([]);
  const [filteredConteneur, setFilteredConteneur] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [id_get, setSelectedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalConteneurOpen, setIsModalConteneurOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [selectedFalseProjet, setSelectedFalseProjet] = useState("");
  const [pfalse, setPfalse] = useState([]);
  const fileInput = useRef();
  const [conteneur, setConteneur] = useState({
    projet_id: "",
    num_conteneur: "",
    line: "",
    type: "",
    tare: "",
  });

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/conteneur.xlsx";
    downloadLink.download = "conteneur.xlsx";
    downloadLink.click();
  };

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

  const getProjetFalse = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/projet/false")
      .then(({ data }) => {
        setLoading(false);
        setPfalse(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const customStylesModal = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
    },
    overlay: {
      backgroundColor: "rgb(189 189 189 / 75%)",
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
            to={`/container/historicConteneur/${row.id}`}
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
      .get("http://localhost:8081/conteneur")
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

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = conteneurs.filter((item) => {
        return (
          item.num_conteneur?.includes(searchQuery) ||
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

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("file", fileInput.current.files[0]);
    formData.append("projet_id", conteneur.projet_id);
    formData.append("num_conteneur", conteneur.num_conteneur);
    formData.append("line", conteneur.line);
    formData.append("tare", conteneur.tare);
    formData.append("type", conteneur.type);

    axios
      .post("http://localhost:8081/create/conteneur/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setLoading(true);
        setErrors({});
        setIsModalConteneurOpen(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };

  useEffect(() => {
    getContainer();
    getProjetFalse();
  });

  return (
    <div className="conteneurIn">
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
          <Modal
            isOpen={isModalConteneurOpen}
            onRequestClose={() => setIsModalConteneurOpen(false)}
            contentLabel="Projet Modal"
            style={customStylesModal}
          >
            <div className="align upload">
              <form className="form" onSubmit={onSubmit}>
                <span className="form-title">Upload your file</span>
                <p className="form-paragraph">File should be an image</p>
                <label className="drop-container">
                  <span className="drop-title">Drop files here</span>
                  or
                  <input
                    type="file"
                    ref={fileInput}
                    accept=".xlsx, .xls"
                    required=""
                    id="file-input"
                  />
                </label>
                <div className="btn_upload">
                  <button className="btn">Save</button>
                  <button className="download-button" onClick={handleDownload}>
                    <div className="docs">
                      <svg
                        className="css-i6dzq1"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        fill="none"
                        stroke-width="2"
                        stroke="currentColor"
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line y2="13" x2="8" y1="13" x1="16"></line>
                        <line y2="17" x2="8" y1="17" x1="16"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>{" "}
                      fFiche a remplir
                    </div>
                    <div className="download">
                      <svg
                        className="css-i6dzq1"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        fill="none"
                        stroke-width="2"
                        stroke="currentColor"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line y2="3" x2="12" y1="15" x1="12"></line>
                      </svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
