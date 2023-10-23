import React from "react";

export default function InfoClient(props) {
  const { id } = props.match.params;

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Selected ID: {id}</p>
    </div>
  );
}
