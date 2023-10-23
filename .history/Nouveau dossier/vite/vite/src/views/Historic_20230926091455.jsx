import { useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from 'react';

export default function Historic() {
    let {num_container} = useParams();
    const [loading, setLoading] = useState(false);
    const [historics, setHistorics] =useState([]);
    /*const [historics, setHistorics] = useState({
        id_container: null,
        client: '',
        date_in:'',
        tp_location: '',
        position: '',
        category: '',
        status: '',
        transport: '',
        date_out: ''
    });*/

    const getContainer = () => {
        if (num_container) {
            setLoading(true);
        axios.get(`http://localhost:8081/container/${num_container}`)
        .then(({ data }) => {
            setLoading(false);
            setHistorics(data[0]);
          })
          .catch(() => {
            setLoading(false);
          });
        } else {
            console.log('no num_container')
        }
    }

    useEffect(() => {
        getContainer();
    }, []);

    console.log (historics);

  return (
    <>
        <div></div>
    </>
  )
}
