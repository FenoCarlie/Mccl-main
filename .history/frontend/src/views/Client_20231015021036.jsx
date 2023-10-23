import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

export default function Client() {
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [filteredClient, setFilteredClient] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getProjet = (clientId, clientName) => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/projet/${clientId}`)
      .then(({ data }) => {
        setLoading(false);
        setSelectedProjects(data);
        setSelectedId(clientId); // Set the selected client ID
        setSelectedName(clientName); // Set the selected client name
        setIsModalOpen(true); // Open the modal
      })
      .catch(() => {
        setLoading(false);
      });
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
          <h3>Client: {client_get}</h3>
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
          {selectedId && (
            <button
              className="btn-add"
              onClick={() => getProjet(selectedId, selectedName)}
              disabled={!selectedId}
            >
              Créer projet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
