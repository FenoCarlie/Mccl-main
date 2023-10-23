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
          <button className="btn-add mb-10" onClick={() => newConteneur()}>
            Ajout conteneur
          </button>
        </div>







import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { iconsImgs } from "../icon/icone";
import Modal from "react-modal";

export default function Client() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [id_get, setSelectedId] = useState(null);
  const [isModalClientOpen, setIsModalClientOpen] = useState(false);
  const [filteredClient, setFilteredClient] = useState([]);
  const { setNotification } = useStateContext();

  const [client, setClient] = useState({
    nom: "",
    adresse: "",
    contacte: "",

  });

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

  const onSubmitClient = (ev) => {
    ev.preventDefault();

    axios
      .post("http://localhost:8081/create/client", {
        nom: clients.nom,
        adresse: clients.adresse,
        contacte: clients.contacte,
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
    { name: "Contact", selector: "contact" },
    { name: "Email", selector: "email" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              setModalOpen(true);
              setSelectedId(row.id);
            }}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter(
    (column) => column.selector !== "id"
  );
  

  useEffect(() => {
    getClient();
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = container.filter((item) => {
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
      </div>
    </div>
  );
}

{projets.length === 0 ? (
  <p>Aucun projet</p>
) : (
  projets.map((projet) => (
    
  ))
)}

if (pathWithoutId === 'http://localhost:5173/projet/infoProjet') {
  <Link 
                        to={`/projet/infoProjet/infoConteneur/${conteneur.id}`}
                      >Actif
                      </Link>
} else if (pathWithoutId === 'http://localhost:5173/client/infoClient/infoProjet/') {
  <Link 
                        to={`/client/infoClient/infoProjet/infoConteneur/${conteneur.id}`}
                      >Actif
                      </Link>
}



<Modal
        isOpen={isModalMouvementOpen}
        onRequestClose={() => setIsModalMouvementOpen(false)}
        contentLabel="Mouvement Modal"
        style={customStylesModal}
      >
        <div className="transport_step">
          <div className="transport_step_container cookie-card">
            <h1 className="tittle">{}</h1>
            <div className="step description">
              <div className="step-container">
                {currentStep === 0 ? (
                  <>
                    <h3>location</h3>
                    {selectedCategory === "Import" && <></>}
                    {selectedCategory === "Export" && <></>}
                  </>
                ) : currentStep === 1 ? (
                  <>
                    <h3>transport</h3>

                    {selectedTransport === "Truck" && <></>}

                    {selectedTransport === "Rail" && <></>}
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <h3>validation</h3>
                  </>
                ) : null}
              </div>
              <div className="button_step">
                {currentStep >= 0 && currentStep < 2 && (
                  <div className="step-buttons">
                    {currentStep === 0 ? null : (
                      <button onClick={() => setCurrentStep(currentStep - 1)}>
                        <span className="previous">previous</span>
                      </button>
                    )}
                    <button onClick={() => setCurrentStep(currentStep + 1)}>
                      <span className="next">Next</span>
                    </button>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="step-buttons">
                    <button onClick={() => setCurrentStep(currentStep - 1)}>
                      <span className="previous">previous</span>
                    </button>
                    <button>validate</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="transport_step_footer">
            {currentStep >= 0 && (
              <Stepper
                steps={[
                  { title: "location" },
                  { title: "transport" },
                  { title: "validation" },
                ]}
                activeStep={currentStep}
              />
            )}
          </div>
        </div>
      </Modal>

{selectedMouvement === "Import" && <></>}
{selectedCategory === "Export" && <></>}