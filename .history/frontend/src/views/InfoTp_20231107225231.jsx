import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function InfoTp() {
  const { TpId } = useParams();
  const { getIn, setGetIn } = useState("");
  const { getOut, setGetOut } = useState([]);
  const [loading, setLoading] = useState(true);

  const getGetIn = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/getIn/${TpId}`)
      .then(({ data }) => {
        console.log(data);
        setGetIn(data);
        setLoading(false);
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
        setLoading(false);
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
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Get in/Get out</h3>
          </div>
          <div></div>
        </div>
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
