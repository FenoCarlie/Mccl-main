import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { iconsImgs } from "../icon/icone";

export default function Tp() {
  const [loading, setLoading] = useState(false);
  const [tp, setTp] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTp, setFilteredTp] = useState([]);

  const getTp = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/tp")
      .then(({ data }) => {
        setLoading(false);
        setTp(data);
        setFilteredTp(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTp();
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
    { name: "Code location", selector: "code_location" },
    { name: "Localisation", selector: "localisation" },
    { name: "Nom", selector: "nom" },
    {
      cell: (row) => (
        <div>
          <Link
            className="openModalBtn button_pers"
            to={`/projet/infoTp/${row.id}`}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </Link>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  useEffect(() => {
    const handleFilter = () => {
      if (Array.isArray(tp)) {
        const filteredData = tp.filter((item) => {
          return (
            item.code_location?.includes(searchQuery) ||
            item.localisation?.includes(searchQuery) ||
            item.nom?.includes(searchQuery)
          );
        });
        setFilteredTp(filteredData);
      }
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, tp]);

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
                setIsModalProjetOpen(true);
              }}
            >
              Nouveau projet
            </button>
          </div>
        </div>
      </div>

      <div className="card animated fadeInDown .table-container">
        <DataTable
          columns={columnsToDisplay}
          data={filteredProjet}
          customStyles={customStyles}
          noHeader
          responsive
          striped
          highlightOnHover
          pointerOnHover
        />
      </div>
      <div className="">
        <Modal
          isOpen={isModalProjetOpen}
          onRequestClose={() => setIsModalProjetOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Creation projet</h2>

          <div className="input-container">
            <label htmlFor="client_projet" className="input-label">
              Client
            </label>
            <select
              className="input-field"
              value={client}
              onChange={handleSelectClient}
              id="client_projet"
            >
              <option value="" disabled hidden style={{ color: "gray" }}>
                Client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom}
                </option>
              ))}
            </select>
            <span className="input-highlight"></span>
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
          <div className="input-container">
            <label htmlFor="type" className="input-label">
              Type de projet
            </label>
            <select
              className="input-field"
              value={type}
              onChange={handleSelectType}
              id="type"
            >
              <option
                value=""
                disabled
                hidden
                className=""
                style={{ color: "gray" }}
              >
                Type de projet
              </option>
              {optionsTypeProjet.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="custom-option"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <span className="input-highlight"></span>
          </div>

          <form onSubmit={onSubmit}>
            <button className="btn">Save</button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
