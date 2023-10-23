import { useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from 'react';

export default function Historic() {
    let {num_container} = useParams();
    const [loading, setLoading] = useState(false);
    const [historics, setHistorics] = useState([]);

    const getContainer = () => {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${num_container}`)
        .then(({ data }) => {
            setLoading(true);
            setHistorics(data[0]);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
    }

    useEffect(() => {
        getContainer();
    }, []);

    console.log (data);

  return (
    <>
        <div></div>
    </>
  )
}
