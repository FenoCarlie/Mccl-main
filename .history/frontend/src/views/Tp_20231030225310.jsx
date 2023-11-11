import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { iconsImgs } from "../icon/icone";
import DataTable from "react-data-table-component";

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
            <button className="btn-add">Nouveau Terre plain</button>
          </div>
        </div>
      </div>

      <div className="card animated fadeInDown .table-container">
        <DataTable
          columns={columnsToDisplay}
          data={filteredTp}
          customStyles={customStyles}
          noHeader
          responsive
          striped
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
}
