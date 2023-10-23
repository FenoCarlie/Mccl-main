import { useParams, useState } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';

export default function Historic() {
    let {num_container} = useParams();
    const [loading, setLoading] = useState(false);
    const [historics, setHistorics] = useState([]);

    const getContainer = () => {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${num_container}`)
        .then(({ data }) => {
            setLoading(false);
            setHistorics(data[0]);
          })
          .catch(() => {
            setLoading(false);
          });
    }

    useEffect(() => {
        getContainer();
    }, [])

  return (
    <>
        <div>{historics}</div>
    </>
  )
}
