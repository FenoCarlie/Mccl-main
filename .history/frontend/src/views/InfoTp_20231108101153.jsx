import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        console.error("Erreur lors de la récupération de Get In :", error);
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
        console.error("Erreur lors de la récupération de Get Out :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getGetOut(TpId);
    getGetIn(TpId);
  }, [TpId]);

  return (
    <div className="tp">
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
              {/* Affichez ici les résultats de Get In */}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="card">
            <div className="bannier">
              <div className="card-header">
                <h3>Get Out</h3>
              </div>
              {/* Affichez ici les résultats de Get Out */}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
