import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function ContainerForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [user, setUser] = useState({
    id_container: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  
  return (
    <>
      {container.id && <h1>Update container: {user.name}</h1>}
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
            <input value={container.name} onChange={ev => setUser({...container, name: ev.target.value})} placeholder="Name"/>
            <input value={container.email} onChange={ev => setUser({...container, email: ev.target.value})} placeholder="Email"/>
            <input type="password" onChange={ev => setUser({...container, password: ev.target.value})} placeholder="Password"/>
            <input type="password" onChange={ev => setUser({...container, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
