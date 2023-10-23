import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";
import {iconsImgs} from "../icon/icone"

export default function Container() {
  const [container, setContainer] = useState([]);
  const [filteredContainer, setFilteredContainer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [id_container, setSelectedId] = useState(null);

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
    { name: "Id_container", selector: "id_container"},
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
              onClick={() => {
                setModalOpen(true);
                setSelectedId(row.id_container); // Set the id of the clicked row
              }}
            >
              <img src={iconsImgs.menu_points} alt=""/>
          </button>
        </div>
      ),
    }
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== 'id_container');

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
          item.client?.includes(searchQuery) ||
          item.type?.includes(searchQuery) ||
          item.category?.includes(searchQuery) ||
          item.status?.includes(searchQuery) ||
          item.booking?.includes(searchQuery) ||
          item.line?.includes(searchQuery)
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
            columns={columnsToDisplay}
            data={filteredContainer}
            customStyles={customStyles}
            pagination
          />
        </div>
        {modalOpen && <InfoContainer selectedId={id_container} setOpenModal={setModalOpen} />}
        {console.log(id_container)}
      </div>
    </div>
  );
}
