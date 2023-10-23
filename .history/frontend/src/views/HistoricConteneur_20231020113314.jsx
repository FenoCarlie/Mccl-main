import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function HistoricConteneur() {
  const { conteneurId } = useParams();
  const [loading, setLoading] = useState(true);
  const [conteneur, setConteneur] = useState(null);
  const [filteredConteneur, setFilteredConteneur] = useState([]);

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

  useEffect(() => {
    getConteneur(conteneurId);
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
