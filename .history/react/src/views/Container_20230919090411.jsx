import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";

export default function Container() {
  const [container, setContainer] = useState([]);
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
    { name: "Number of container", selector: "num_container" },
    { name: "Client", selector: "client_name" },
    { name: "Type", selector: "type" },
    { name: "Category", selector: "category" },
    { name: "Status", selector: "status" },
    { name: "Line", selector: "line" },
    { name: "Booking", selector: "booking" },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="openModalBtn"
            onClick={async () => {
              setModalOpen(true);
              try {
                const response = await axios.post('http://localhost:8081/', { id_container: row.id });
                setPostData(response.data);
                console.log(response.data);
              } catch (error) {
                console.error("An error occurred while sending the POST request:", error);
              }
            }}
          >
            Open
          </button>
        </div>
      ),
    }
  ];

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/")
      .then(({ data }) => {
        setLoading(false);
        setContainer(data);
        setFilteredContainer(data); // Initialize filteredContainer with all container data
      })
      .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
      });
  };

  useEffect(() => {
    getContainer();
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = container.filter((item) => {
        return (
          item.num_container?.includes(searchQuery) ||
          item.name_container?.includes(searchQuery) ||
          item.type?.includes(searchQuery) ||
          item.category?.includes(searchQuery) ||
          item.status?.includes(searchQuery) ||
          item.live?.includes(searchQuery)
        );
      });
      setFilteredContainer(filteredData);
    };

    handleFilter(); // Initial filtering when component mounts

    const debounceTimer = setTimeout(() => {
      handleFilter(); // Filtering after a small delay to avoid excessive updates
    }, 300);

    return () => clearTimeout(debounceTimer); // Clear timeout when component unmounts
  }, [searchQuery, container]);

  return (
    <div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Container</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link className="btn-add" to="/container/new">
            Add new
          </Link>
        </div>
        <div className="card animated fadeInDown .table-container">
          <DataTable
            columns={columns}
            data={filteredContainer}
            customStyles={customStyles}
            pagination
          />
        </div>
        {modalOpen && <InfoContainer setOpenModal={setModalOpen} />}
      </div>
    </div>
  );
}
