import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";

export default function Client() {
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [id_get, setSelectedId] = useState(null);
  const [filteredClient, setFilteredClient] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);

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

  console.log("client" + client);
  const getProjet = (clientId) => {
    setLoading(true);
    axios
      .get(`/projet/${clientId}`) // Assuming this endpoint returns projects for a specific client
      .then(({ data }) => {
        setLoading(false);
        setSelectedProjects(data); // Set the projects of the selected client
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
              setSelectedId(row.id);
              getProjet(row.id); // Fetch projects when a client is selected
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
  useEffect(() => {}, []);

  console.log(id_get);

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
        <Link className="btn-add" to="/client/new">
          Add new
        </Link>
      </div>
      <div className="align">
        <div className="card animated fadeInDown w-700">
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
        <div className="card animated fadeInDown">
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
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
