import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from 'axios';
import {useStateContext} from "../context/ContextProvider.jsx";

export default function ContainerForm() {
  const navigate = useNavigate();
  let {id_container} = useParams();
  const [container, setContainer] = useState({
    id_container: null,
    num_container: '',
    name_container: '',
    type: '',
    category: '',
    status: '',
    live: '',
    code_location_tp: '',
    position: '',
    date_in: '',
    date_out: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id_container) {
    useEffect(() => {
      setLoading(true)
      axios.get(`http://localhost:8081/container/${id_container}`)
        .then(({data}) => {
          setLoading(false)
          setContainer(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (container.id_container) {
      axios.put(`/container/${container.id_container}`, container)
        .then(() => {
          setNotification('User was successfully updated')
          navigate('/container')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axios
        .post('http://localhost:8081/create', container)
        .then(() => {
          setNotification('User was successfully created')
          navigate('/container')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }
  
  return (
    <>
      {container.id && <h1>Update container: {container.num_container}</h1>}
      {!container.id && <h1>New Container</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input value={container.num_container} onChange={ev => setContainer({...container, num_container: ev.target.value})} placeholder="Number of container"/>
            <input value={container.name_container} onChange={ev => setContainer({...container, name_container: ev.target.value})} placeholder="Name of container"/>
            <input value={container.type} onChange={ev => setContainer({...container, type: ev.target.value})} placeholder="Type"/>
            <input value={container.category} onChange={ev => setContainer({...container, category: ev.target.value})} placeholder="Category"/>
            <input value={container.Status} onChange={ev => setContainer({...container, Status: ev.target.value})} placeholder="status"/>
            <input value={container.live} onChange={ev => setContainer({...container, live: ev.target.value})} placeholder="Live"/>
            <input value={container.code_location_tp} onChange={ev => setContainer({...container, code_location_tp: ev.target.value})} placeholder="Code of location T.P"/>
            <input value={container.position} onChange={ev => setContainer({...container, position: ev.target.value})} placeholder="Position"/>
            <input type="date" onChange={ev => setContainer({...container, password: ev.target.value})} placeholder="Password"/>
            <input type="date" onChange={ev => setContainer({...container, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
