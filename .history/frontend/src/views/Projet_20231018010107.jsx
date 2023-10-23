import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [isModalProjetOpen, setIsModalProjetOpen] = useState(false);

  const [isModalModifyProjeOpen, setIsModalModifyProjeOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [selectedFalseProjet, setSelectedFalseProjet] = useState("");
  const [projet, setProjet] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
  });
  const [projets, setProjets] = useState([]);
  const [projetToModify, setProjetToModify] = useState({});

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
  console.log("client_projet" + projets);
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

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/projet", {
        client_projet: projet.client_projet,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalProjetOpen(false);
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

  const handleModifyProjetClick = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/${projetId}`)
      .then(({ data }) => {
        setProjetToModify(data);
        setIsModalModifyProjeOpen(true);
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
    { name: "Booking", selector: "num_booking" },
    { name: "Client", selector: "nom" },
    {
      cell: (row) => (
        <div>
          <Link
            className="openModalBtn button_pers"
            to={`/projet/infoProjet/${row.id}`}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </Link>

          <button
            className="openModalBtn button_pers"
            onClick={() => handleModifyProjetClick(row.id)}
          >
            <img src={iconsImgs.edit} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  useEffect(() => {
    const handleFilter = () => {
      if (Array.isArray(projet)) {
        const filteredData = projet.filter((item) => {
          return (
            item.nom_projet?.includes(searchQuery) ||
            item.num_booking?.includes(searchQuery) ||
            item.nom?.includes(searchQuery)
          );
        });
        setFilteredProjet(filteredData);
      }
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, projets]);

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
      </div>
        <h1>Projet</h1>
      <div className="">
          <DataTable
            columns={columnsToDisplay}
            data={filteredProjet}
            customStyles={customStyles}
            pagination
          />
        </div>

        <Modal
          isOpen={isModalProjetOpen}
          onRequestClose={() => setIsModalProjetOpen(false)}
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
              id="client_projet"
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
              id="nom_projet"
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
              id="num_booking"
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
