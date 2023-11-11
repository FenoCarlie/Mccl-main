import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Tp() {
  const { conteneurId } = useParams();
  const [loading, setLoading] = useState(true);
  const [conteneur, setConteneur] = useState(null);

  return <div>terre plein</div>;
}
