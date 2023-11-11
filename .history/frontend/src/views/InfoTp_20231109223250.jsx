import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import GetIn from "./GetIn";
import { iconsImgs } from "../icon/icone";
import Modal from "react-modal";

export default function InfoTp() {
  const { TpId } = useParams();
  const [getIn, setGetIn] = useState([]);
  const [getOut, setGetOut] = useState([]);
  const [vide, setVide] = useState([]);
  const [plain, setPlain] = useState([]);
  const [totalVide, setTotalVide] = useState("");
  const [totalPlain, setTotalPlain] = useState("");
  const [isModalGetInOpen, setIsModalGetInOpen] = useState(false);
  const [isModalShiftignOpen, setIsModalShiftignOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [updatedPosition, setUpdatedPosition] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedContainer = {
      position: updatedPosition,
      date_debut: new Date().toISOString(), // Utilise la date actuelle comme date de début
    };

    axios
      .put(
        `http://localhost:8081/stockage/GetIn/${selectedContainer.id}`,
        updatedContainer
      )
      .then((response) => {
        console.log(response.data);
        setIsModalGetInOpen(false);
        setSelectedContainer(null);
        getGetOut(TpId);
        getGetIn(TpId);
        getVide(TpId);
        getPlain(TpId);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const customStylesModal = {
    content: {
      top: "35%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      height: "600px",
      borderRadius: "15px",
    },
    overlay: {
      backgroundColor: "rgb(189 189 189 / 75%)",
    },
  };

  const getGetIn = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/getIn/${TpId}`)
      .then(({ data }) => {
        console.log(data);
        setGetIn(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };
  const getGetOut = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/getOut/${TpId}`)
      .then(({ data }) => {
        setGetOut(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };
  const getVide = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/TpVide/${TpId}`)
      .then(({ data }) => {
        setVide(data.stockage);
        setTotalVide(data.total_conteneurs[0]);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };
  const getPlain = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/TpPlain/${TpId}`)
      .then(({ data }) => {
        setPlain(data.stockage);
        setTotalPlain(data.total_conteneurs[0]);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getGetOut(TpId);
    getGetIn(TpId);
    getVide(TpId);
    getPlain(TpId);
  }, [TpId]);

  console.log(getOut);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div className="tp">
      <div className="">
        <Tabs>
          <TabList>
            <Tab>Get In</Tab>
            <Tab>Get Out</Tab>
          </TabList>

          <TabPanel>
            <div className="card">
              <div className="bannier">
                <div className="card-header">
                  <h3>Get In</h3>
                </div>
                {getIn.length === 0 ? (
                  <>
                    <div className="align projet-info-header contenue">
                      <h2>Aucun Conteneur</h2>
                    </div>
                  </>
                ) : (
                  getIn.map((getIn) => (
                    <div className="tp-info-container" key={getIn.id}>
                      <div className="align projet-info-header contenue">
                        <h2>{getIn.conteneur_num_conteneur}</h2>
                        <button
                          className="get"
                          onClick={() => {
                            setIsModalGetInOpen(true);
                            setSelectedContainer(getIn);
                          }}
                        >
                          <img
                            src={iconsImgs.getIn}
                            alt=""
                            className="info_icon"
                          />
                        </button>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Numero Projet :</strong>
                        </p>
                        <p>{getIn.projet_nom_projet}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="card">
              <div className="bannier">
                <div className="card-header">
                  <h3>Get Out</h3>
                </div>
                {getOut.length === 0 ? (
                  <>
                    <div className="align projet-info-header contenue">
                      <h2>Aucun Conteneur</h2>
                    </div>
                  </>
                ) : (
                  getOut.map((getOut) => (
                    <div className="tp-info-container" key={getOut.id}>
                      <div className="align projet-info-header contenue">
                        <h2>{getOut.conteneur_num_conteneur}</h2>
                        <button className="get">
                          <img
                            src={iconsImgs.getOut}
                            alt=""
                            className="info_icon"
                          />
                        </button>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Position :</strong>
                        </p>
                        <p>{getOut.position}</p>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Date d'entre :</strong>
                        </p>
                        <p>{formatDate(getOut.date_debut)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Conteneur vide</h3>
          </div>
        </div>
        {vide.length === 0 ? (
          <>
            <div className="align projet-info-header contenue">
              <h2>Aucun Conteneur</h2>
            </div>
          </>
        ) : (
          vide.map((vide) => (
            <>
              <div className="tp-info-container" key={vide.id}>
                <div className="align projet-info-header contenue">
                  <h2>{vide.conteneur_num_conteneur}</h2>
                  <button className="get">
                    <img src={iconsImgs.vide} alt="" className="info_icon" />
                  </button>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Position :</strong>
                  </p>
                  <p>{vide.position}</p>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Date d'entre :</strong>
                  </p>
                  <p>{formatDate(vide.date_debut)}</p>
                </div>
              </div>
              <div>
                <button>Depotage</button>
                <button
                  onClick={() => {
                    setIsModalGetInOpen(true);
                    setSelectedContainer(getIn);
                  }}
                >
                  Shifting
                </button>
              </div>
            </>
          ))
        )}
      </div>
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Conteneur plain</h3>
          </div>
        </div>
        {plain.length === 0 ? (
          <>
            <div className="align projet-info-header contenue">
              <h2>Aucun Conteneur</h2>
            </div>
          </>
        ) : (
          plain.map((plain) => (
            <div className="tp-info-container" key={plain.id}>
              <div className="align projet-info-header contenue">
                <h2>{plain.conteneur_num_conteneur}</h2>
                <button className="get">
                  <img src={iconsImgs.plain} alt="" className="info_icon" />
                </button>
              </div>
              <div className="align contenue">
                <p>
                  <strong>Position :</strong>
                </p>
                <p>{plain.position}</p>
              </div>
              <div className="align contenue">
                <p>
                  <strong>Date d'entre :</strong>
                </p>
                <p>{formatDate(plain.date_debut)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={isModalGetInOpen}
        onRequestClose={() => {
          setIsModalGetInOpen(false);
          setSelectedContainer(null);
        }}
        contentLabel="Projet Modal"
        style={customStylesModal}
      >
        {selectedContainer && (
          <div>
            <h2>{selectedContainer.conteneur_num_conteneur}</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Update Conteneur Num:
                <input
                  type="text"
                  value={updatedPosition}
                  onChange={(e) => setUpdatedPosition(e.target.value)}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isModalShiftignOpen}
        onRequestClose={() => {
          setIsModalShiftignOpen(false);
          setSelectedContainer(null);
        }}
        contentLabel="Projet Modal"
        style={customStylesModal}
      >
        {selectedContainer && (
          <div>
            <h2>{selectedContainer.conteneur_num_conteneur}</h2>
            <div className="align contenue">
              <p>
                <strong>Position actuel :</strong>
              </p>
              <p>{selectedContainer.position}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Nouveau position:
                <input
                  type="text"
                  value={updatedPosition}
                  onChange={(e) => setUpdatedPosition(e.target.value)}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
