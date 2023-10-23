import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

export default function Projet() {
  const [projet, setProjet] = useState([]);
  const [filteredProjet, setFilteredProjet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalProjeOpen, setIsModalProjeOpen] = useState(false);
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
    { name: "Date de creation", selector: "date_creation" },
    { name: "Client", selector: "nom" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              setSelectedProjet(row.nom_projet);
              getProjet(row.id);
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
      const filteredData = projet.filter((item) => {
        return (
          item.nom_projet?.includes(searchQuery) ||
          item.nom?.includes(searchQuery)
        );
      });
      setFilteredProjet(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, projet]);

  const newProje = () => {
    // Set the selected client name
    setIsModalProjeOpen(true);
  };

  useEffect(() => {
    getProjet();
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
          <h3>Client: {selectedProjet}</h3>
          <table>
            <thead>
              <tr>
                <th>Numero projet</th>
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
            {!loading && (
              <tbody>
                {selectedProjet.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nom_projet}</td>
                    <td>{p.nom_projet}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="card action">
          <button className="btn-add" onClick={() => newClient()}>
            Créer Client
          </button>
          <button className="btn-add" onClick={() => newProje()}>
            Créer projet
          </button>
        </div>
        <Modal
          isOpen={isModalClientOpen}
          onRequestClose={() => setIsModalClientOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Creation client</h2>

          <div className="input-container">
            <label htmlFor="Nom" className="input-label">
              Nom
            </label>
            <input
              placeholder="Nom"
              className="input-field"
              type="text"
              value={clients.nom}
              onChange={(ev) =>
                setClients({
                  ...clients,
                  nom: ev.target.value,
                })
              }
              id="nom"
            />
          </div>
          <div className="input-container">
            <label htmlFor="Adresse" className="input-label">
              Adresse
            </label>
            <input
              placeholder="Adresse"
              className="input-field"
              type="text"
              value={clients.adresse}
              onChange={(ev) =>
                setClients({
                  ...clients,
                  adresse: ev.target.value,
                })
              }
              id="adresse"
            />
          </div>
          <div className="input-container">
            <label htmlFor="Contact client" className="input-label">
              Contact
            </label>
            <input
              placeholder="Contact client"
              className="input-field"
              type="text"
              value={clients.contacte}
              onChange={(ev) =>
                setClients({
                  ...clients,
                  contacte: ev.target.value,
                })
              }
              id="contact" // Ajoutez un id unique
            />
          </div>

          <form onSubmit={onSubmitClient}>
            <button className="btn">Save</button>
          </form>
        </Modal>

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
      </div>
    </div>
  );
}
