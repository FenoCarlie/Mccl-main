import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getUsers();
  }, [])

  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers()
      })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Container</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
          <th >Number of container</th>
              <th >Name</th>
              <th >Type</th>
              <th >Category</th>
              <th >Status</th>
              <th >Live</th>
              <th >Code of location T.P</th>
              <th >Position</th>
              <th >Entry date</th>
              <th >Release date</th>
              <th >Action</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
















import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useStateContext } from "../context/ContextProvider.jsx";

export default function ContainerForm() {
  const navigate = useNavigate();
  let { id_container } = useParams();
  const [container, setContainer] = useState({
    id_container: null,
    num_container: '',
    name_container: '',
    type: '',
    category: '',
    status: '',
    live: '',
    code_location_tp: '',
    tp_name: '',
    position: '',
    date_in: '',
    date_out: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id_container) {
      setLoading(true);
      axios.get(`http://localhost:8081/container/${id_container}`)
        .then(({ data }) => {
          setLoading(false);
          setContainer(data);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setContainer({
        id_container: null,
        num_container: '',
        name_container: '',
        type: '',
        category: '',
        status: '',
        live: '',
        code_location_tp: '',
        tp_name: '',
        position: '',
        date_in: '',
        date_out: ''
      });
    }
  }, [id_container]);

  const onSubmit = ev => {
    ev.preventDefault();
    if (container.id_container) {
      axios.put(`http://localhost:8081/container/${container.id_container}`, container)
        .then(() => {
          setNotification('Container was successfully updated');
          navigate('/container');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axios
        .post('http://localhost:8081/create', container)
        .then(() => {
          setNotification('Container was successfully created');
          navigate('/container');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      <h1>{container.id_container ? `Update container: ${container.num_container}` : 'New Container'}</h1>
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
          <input value={container.num_container} onChange={ev => setContainer({ ...container, num_container: ev.target.value })} placeholder="Number of container" />
            <input value={container.name_container} onChange={ev => setContainer({ ...container, name_container: ev.target.value })} placeholder="Name of container" />
            <input value={container.type} onChange={ev => setContainer({ ...container, type: ev.target.value })} placeholder="Type" />
            <input value={container.category} onChange={ev => setContainer({ ...container, category: ev.target.value })} placeholder="Category" />
            <input value={container.status} onChange={ev => setContainer({ ...container, Status: ev.target.value })} placeholder="status" />
            <input value={container.live} onChange={ev => setContainer({ ...container, live: ev.target.value })} placeholder="Live" />
            <input value={container.code_location_tp} onChange={ev => setContainer({ ...container, code_location_tp: ev.target.value })} placeholder="Code of location T.P" />
            <input value={container.tp_name} onChange={ev => setContainer({ ...container, tp_name: ev.target.value })} placeholder="Name of T.P" />
            <input value={container.position} onChange={ev => setContainer({ ...container, position: ev.target.value })} placeholder="Position" />
            <input type="date" onChange={ev => setContainer({ ...container, password: ev.target.value })} placeholder="Password" />
            <input type="date" onChange={ev => setContainer({ ...container, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
            <button className="btn">Save</button>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}

