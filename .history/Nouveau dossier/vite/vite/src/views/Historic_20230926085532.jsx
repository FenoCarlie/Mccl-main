import { useParams } from 'react-router-dom';
import axios from "axios";

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

  return (
    <>

    </>
  )
}
