import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

export default function Projet() {
  const [filteredProjet, setFilteredProjet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalProjeOpen, setIsModalProjeOpen] = useState(false);
  const [isModalConteneurOpen, setIsModalConteneurOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [selectedFalseProjet, setSelectedFalseProjet] = useState("");
  const [projets, setProjets] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
  });
  const [projet, setProjet] = useState([]);
  const [pfalse, setPfalse] = useState([]);

  const getProjetDetails = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/${projetId}`)
      .then(({ data }) => {
        setProjets(data);
      })
      .catch(() => {
        setLoading(false);
      });
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
  console.log("false" + pfalse);
  const getProjet = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/projet")
      .then(({ data }) => {
        setLoading(false);
        setProjet(data);
        setFilteredProjet(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  console.log(projets);

  const handleProjetClick = (projetId) => {
    setSelectedProjet(projetId);
    getProjetDetails(projetId);
  };

  const onSubmitProjet = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/projet", {
        client_projet: projet.client_projet,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalProjeOpen(false);
        setErrors({});
        getProjet();
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };
  const onSubmitcontenaur = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/conteneur", {
        client_projet: projet.client_projet,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalConteneurOpen(false);
        setErrors({});
        getProjet();
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
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

  const columns = [
    { name: "Id", selector: "id" },
    { name: "Projet", selector: "nom_projet" },
    { name: "Booking", selector: "num_booking" },
    { name: "Client", selector: "nom" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => handleProjetClick(row.id)}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  const handleFilter = () => {
    if (Array.isArray(projet)) {
      const filteredData = projet.filter((item) => {
        return (
          item.nom_projet?.includes(searchQuery) ||
          item.num_booking?.includes(searchQuery) ||
          item.client_projet?.includes(searchQuery)
        );
      });
      setFilteredProjet(filteredData);
    }
  };

  useEffect(() => {
    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, projet]);

  const newProje = () => {
    setIsModalProjeOpen(true);
  };

  const customStylesModal = {
    content: {
      top: "20%",
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

  useEffect(() => {
    getProjet();
    getProjetFalse();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Projet</h1>
      </div>
      <div className="align">
        <div className="card animated fadeInDown w-700 h-750">
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
          <DataTable
            columns={columnsToDisplay}
            data={filteredProjet}
            customStyles={customStyles}
            pagination
          />
        </div>
        <div className="card animated fadeInDown w-500">
          <h3>{projets.num_projet}</h3>
          <div className="list">
            <ul>
              <li>
                Client:
                <label className="info_label">{projets.nom}</label>
              </li>
              <li>
                Status:
                <label className="info_label">{projets.status}</label>
              </li>
              <li>
                Booking:
                <label className="info_label">{projets.num_booking}</label>
              </li>
              <li>
                Date de creation:
                <label className="info_label">{projets.date_creation}</label>
              </li>
              <li>
                Type:
                <label className="info_label">{projets.type}</label>
              </li>
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>Numero conteneur</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan="5" class="text-center">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && <tbody></tbody>}
          </table>
        </div>
        <div className="card action">
          <button className="btn-add mb-10" onClick={() => newProje()}>
            Créer projet
          </button>
          <button className="btn-add mb-10" onClick={() => newProje()}>
            Ajout conteneur
          </button>
        </div>

        <Modal
          isOpen={isModalProjeOpen}
          onRequestClose={() => setIsModalProjeOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Creation projet</h2>

          <div className="input-container">
            <label htmlFor="client" className="input-label">
              Client
            </label>
            <input
              placeholder="Client"
              className="input-field"
              type="text"
              value={projet.client_projet}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  client_projet: ev.target.value,
                })
              }
              id="client_projet" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="Nom projet" className="input-label">
              Nom projet
            </label>
            <input
              placeholder="Nom projet"
              className="input-field"
              type="text"
              value={projet.nom_projet}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  nom_projet: ev.target.value,
                })
              }
              id="nom_projet" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="Numero booking" className="input-label">
              Numero booking
            </label>
            <input
              placeholder="Numero booking"
              className="input-field"
              type="text"
              value={projet.num_booking}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  num_booking: ev.target.value,
                })
              }
              id="num_booking" // Ajoutez un id unique
            />
          </div>

          <form onSubmit={onSubmitProjet}>
            <button className="btn">Save</button>
          </form>
        </Modal>
        <Modal
          isOpen={isModalConteneurOpen}
          onRequestClose={() => setIsModalProjeOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Ajout Conteneur</h2>

          <div className="input-container">
            <label htmlFor="client" className="input-label">
              Client
            </label>
            <input
              placeholder="Client"
              className="input-field"
              type="text"
              value={projet.client_projet}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  client_projet: ev.target.value,
                })
              }
              id="client_projet" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="Nom projet" className="input-label">
              Nom projet
            </label>
            <input
              placeholder="Nom projet"
              className="input-field"
              type="text"
              value={projet.nom_projet}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  nom_projet: ev.target.value,
                })
              }
              id="nom_projet" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="Numero booking" className="input-label">
              Numero booking
            </label>
            <input
              placeholder="Numero booking"
              className="input-field"
              type="text"
              value={projet.num_booking}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  num_booking: ev.target.value,
                })
              }
              id="num_booking" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="selectProjet" className="input-label">
              Projets avec statut "false"
            </label>
            <select
              className="input-field"
              id="selectProjet"
              value={selectedFalseProjet}
              onChange={(ev) => setSelectedFalseProjet(ev.target.value)}
            >
              <option value="" disabled>
                Sélectionnez un projet
              </option>
              {pfalse.map((falseProjet) => (
                <option key={falseProjet.id} value={falseProjet.id}>
                  {falseProjet.nom_projet}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={onSubmitProjet}>
            <button className="btn">Save</button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
