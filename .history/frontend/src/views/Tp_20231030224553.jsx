import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Tp() {
  const [loading, setLoading] = useState(false);
  const [tp, setTp] = useState("");

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

  const getTp = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/projet/false")
      .then(({ data }) => {
        setLoading(false);
        setTp(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTp();
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
