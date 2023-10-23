import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Container() {
    const [container, setContainer] = useState([]);

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
                  <button className="btn btn-info" onClick={() => setOpenModal(true)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
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