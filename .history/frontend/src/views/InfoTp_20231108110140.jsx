import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function InfoTp() {
  const { TpId } = useParams();
  const [getIn, setGetIn] = useState([]);
  const [getOut, setGetOut] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <div className="card projet-info-container">
                      <div className="align projet-info-header contenue">
                        <h2>Aucun Conteneur</h2>
                      </div>
                    </div>
                  </>
                ) : (
                  getIn.map((getIn) => (
                    <div className="" key={getIn.id}>
                      {console.log()}
                      <div className="align projet-info-header contenue">
                        <h2>{getIn.conteneur_num_conteneur}</h2>
                        <label className=""></label>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Numero Booking :</strong>
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
                <ul>
                  {getOut.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
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
    </div>
  );
}
