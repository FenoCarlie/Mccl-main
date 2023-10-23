import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

export default function Client() {
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [filteredClient, setFilteredClient] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [projet, setProjet] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/project", projet)
      .then(() => {
        setNotification("projet was successfully created");
        navigate("/client");
        setErrors({});
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const getClient = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get_client")
      .then(({ data }) => {
        setLoading(false);
        setClient(data);
        setFilteredClient(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getProjet = (clientId) => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/projet/${clientId}`)
      .then(({ data }) => {
        setLoading(false);
        setSelectedProjects(data); // Open the modal
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const newProje = (clientId, clientName) => {
    setSelectedId(clientId); // Set the selected client ID
    setSelectedName(clientName); // Set the selected client name
    setIsModalOpen(true);
  };

  useEffect(() => {
    getClient();
  }, []);

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
    { name: "Adresse", selector: "adresse" },
    { name: "Contacte", selector: "contacte" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              setSelectedName(row.nom);
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Client</h1>
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
            data={filteredClient}
            customStyles={customStyles}
            pagination
          />
        </div>
        <div className="card animated fadeInDown w-500">
          <h3>Client: {selectedName}</h3>
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
                {selectedProjects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nom_projet}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="card action">
          <Link className="btn-add" to="/client/new">
            Ajouter client
          </Link>
          <button
            className="btn-add"
            onClick={() => newProje(selectedId, selectedName)}
          >
            Créer projet
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Projet Modal"
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

          <form onSubmit={onSubmit}>
            <button className="btn">Save</button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
