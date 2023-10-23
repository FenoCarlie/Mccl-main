import React from "react";
import { useParams } from "react-router-dom";

export default function InfoClient() {
  // Utilisez le hook useParams pour accéder aux paramètres de l'URL
  const { clientId } = useParams();

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {clientId}</p>
      {/* Utilisez la valeur de clientId comme vous le souhaitez ici */}
    </div>
  );
}
