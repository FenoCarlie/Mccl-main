import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Container() {
    const [container, setContainer] = useState([]);
    const [loading, setLoading] = useState(false);

    const onDeleteClick = (id_container) => {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return
      }
      axios.delete(`http://localhost:8081/delete/${id_container}`)
      .then(response => {
        setNotification('User was successfully deleted')
        console.log(response.data);
      })
      .catch(error => {
          // Handle the error
          console.error('An error occurred while deleting the container:',error);
      });

    useEffect(() => {
        axios
          .get('http://localhost:8081/')
          .then(res => setContainer(res.data))
          .catch(err => console.log(err));
      }, []);

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
              {container.map((data, i) => (
              <tr key={i}>

                <td>{data.num_container}</td>
                <td>{data.name_container}</td>
                <td>{data.type}</td>
                <td>{data.category}</td>
                <td>{data.status}</td>
                <td>{data.live}</td>
                <td>{data.code_location_tp}</td>
                <td>{data.position}</td>
                <td>{data.date_in}</td>
                <td>{data.date_out}</td>
                <td>
                  <Link className="btn-edit" >Edit</Link>
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