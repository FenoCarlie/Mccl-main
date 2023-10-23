import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { iconsImgs } from "../icon/icone";

export default function HistoricConteneur() {
  const { conteneurId } = useParams();
  const [loading, setLoading] = useState(true);
  const [conteneur, setConteneur] = useState(null);
  const [projet, setProjet] = useState([]);
  const [filteredConteneur, setFilteredConteneur] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getConteneur = (conteneurId) => {
    axios
      .get(`http://localhost:8081/conteneur/${conteneurId}`)
      .then(({ data }) => {
        setConteneur(data[0]);
        setLoading(false);
        console.log(conteneur);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conteneurs :", error);
        setLoading(false);
      });
  };
  const getProjetConteneur = (conteneurId) => {
    axios
      .get(`http://localhost:8081/conteneur/historique/${conteneurId}`)
      .then(({ data }) => {
        setProjet(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conteneurs :", error);
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

  console.log(conteneurId);

  const columns = [
    { name: "id", selector: "id" },
    { name: "Projet", selector: "nom_projet" },
    { name: "Client", selector: "client" },
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

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = projet.filter((item) => {
        return (
          item.nom_projet?.includes(searchQuery) ||
          item.client?.includes(searchQuery)
        );
      });
      setFilteredConteneur(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, projet]);

  useEffect(() => {
    getConteneur(conteneurId);
    getProjetConteneur(conteneurId);
  }, [conteneurId]);
  return (
    <div className="conteneur">
      <h1>Conteneur</h1>
      <div className="align">
        <div>
          {loading ? (
            <p>Chargement en cours...</p>
          ) : (
            <div>
              <div className="card-info Wh">
                <div className="bannier">
                  <h3>Information conteneur</h3>
                </div>
                <div className="description">
                  <p>
                    <strong>Numero conteneur :</strong>
                    {conteneur.num_conteneur}
                  </p>
                  <p>
                    <strong>Line :</strong>
                    {conteneur.line}
                  </p>
                  <p>
                    <strong>Type :</strong>
                    {conteneur.type}
                  </p>
                  <p>
                    <strong>Tare :</strong>
                    {conteneur.tare}
                  </p>
                </div>
              </div>
              <div className="action card">
                <div className="align ">
                  <button
                    className="btn-add"
                    onClick={() => {
                      setIsModalConteneurOpen(true);
                    }}
                  >
                    Nouveau conteneur
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => setIsModalClientOpen(true)}
                  >
                    Modifier client
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="card">
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
          <DataTable
            columns={columns}
            data={filteredConteneur}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}
