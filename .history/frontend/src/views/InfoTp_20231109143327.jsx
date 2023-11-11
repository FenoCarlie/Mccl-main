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
  const [isModalGetInOpen, setIsModalGetInOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState(null);

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

  useEffect(() => {
    getGetOut(TpId);
    getGetIn(TpId);
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
      </div>
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Conteneur plain</h3>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalGetInOpen}
        onRequestClose={() => setIsModalGetInOpen(false)}
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
                  value={updatedContainer}
                  onChange={(e) => setUpdatedContainer(e.target.value)}
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
