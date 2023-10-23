import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProjet = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/${projetId}`)
      .then(({ data }) => {
        setProjet(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du projet :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getClient(clientId);
  }, [clientId]);

  return <div>InfoProjet</div>;
}
