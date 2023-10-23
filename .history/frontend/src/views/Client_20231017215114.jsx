import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { iconsImgs } from "../icon/icone";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Client() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isModalClientOpen, setIsModalClientOpen] = useState(false);
  const [filteredClient, setFilteredClient] = useState([]);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});

  const [client, setClient] = useState({
    nom: "",
    adresse: "",
    contacte: "",
    email: "",
  });

  const newClient = () => {
    setIsModalClientOpen(true);
  };

  const getClient = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get_client")
      .then(({ data }) => {
        setLoading(false);
        setClients(data);
        setFilteredClient(data);
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
  const customStylesModal = {
    content: {
      top: "50px",
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

  const onSubmitClient = (ev) => {
    ev.preventDefault();

    axios
      .post("http://localhost:8081/create/client", {
        nom: client.nom,
        adresse: client.adresse,
        contacte: client.contacte,
        email: client.email,
      })
      .then(() => {
        setNotification("Client was successfully created");
        setIsModalClientOpen(false);
        setLoading(true);
        setErrors({});
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const columns = [
    { name: "id", selector: "id" },
    { name: "Nom", selector: "nom" },
    { name: "Adresse", selector: "adresse" },
    { name: "Contacte", selector: "contacte" },
    { name: "Email", selector: "email" },
    {
      cell: (row) => (
        <div>
          <Link
            className="openModalBtn button_pers"
            to={`/client/infoClient/${row.id}`}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </Link>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  useEffect(() => {
    getClient();
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = clients.filter((item) => {
        return (
          item.nom?.includes(searchQuery) ||
          item.contact?.includes(searchQuery) ||
          item.adresse?.includes(searchQuery)
        );
      });
      setFilteredClient(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, clients]);

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
          <h1>Client</h1>

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
                  newClient();
                }}
              >
                Nouveau client
              </button>
            </div>
          </div>
        </div>
        <div className="card animated fadeInDown .table-container">
          <DataTable
            columns={columnsToDisplay}
            data={filteredClient}
            customStyles={customStyles}
            pagination
          />
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
              value={client.nom}
              onChange={(ev) =>
                setClient({
                  ...client,
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
              value={client.adresse}
              onChange={(ev) =>
                setClient({
                  ...client,
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
              value={client.contacte}
              onChange={(ev) =>
                setClient({
                  ...client,
                  contacte: ev.target.value,
                })
              }
              id="contact" // Ajoutez un id unique
            />
          </div>
          <div className="input-container">
            <label htmlFor="Contact client" className="input-label">
              Contact
            </label>
            <input
              placeholder="Contact client"
              className="input-field"
              type="email"
              value={client.email}
              onChange={(ev) =>
                setClient({
                  ...client,
                  email: ev.target.value,
                })
              }
              id="contact" // Ajoutez un id unique
            />
          </div>

          <form onSubmit={onSubmitClient}>
            <button className="btn">Save</button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
