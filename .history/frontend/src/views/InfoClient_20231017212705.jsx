import React from "react";

export default function InfoClient(props) {
  // Accédez à l'ID depuis les paramètres de la route
  const { clientId } = props.match.params;

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {clientId}</p>
      {/* Utilisez la valeur de clientId comme vous le souhaitez ici */}
    </div>
  );
}
