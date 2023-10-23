import React from "react";

export default function InfoClient(props) {
  
  const { clientId } = props.match.params;

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {clientId}</p>
      
    </div>
  );
}
