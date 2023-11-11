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
      width: "600px",
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
      .post("http://localhost:8081/create/conteneur/exel", formData, {
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
          <Modal
            isOpen={isModalConteneurOpen}
            onRequestClose={() => setIsModalConteneurOpen(false)}
            contentLabel="Projet Modal"
            style={customStylesModal}
          >
            <h2>Ajout Conteneur</h2>

            <form onSubmit={onSubmit}>
              <input type="file" ref={fileInput} accept=".xlsx, .xls" />
              <button className="btn">Save</button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
