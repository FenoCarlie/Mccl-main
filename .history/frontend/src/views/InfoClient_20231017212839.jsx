import React from "react";
import { useParams } from "react-router-dom";

export default function InfoClient() {
  const { clientId } = useParams();

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {clientId}</p>
      {/* Utilisez la valeur de clientId comme vous le souhaitez ici */}
    </div>
  );
}
