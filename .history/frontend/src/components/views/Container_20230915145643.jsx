import { useEffect, useState } from "react";
import axios from "axios";

import ContentTop from "../ContentTop/ContentTop";
import AddContainer from "../../../../AddContainer";
import { Link } from "react-router-dom";

const Container = () => {
  const [container, setContainer] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = () => {
    const containerId = container.id_container;

    axios
      .delete(`http://localhost:8081/delete/${containerId}`)
      .then(() => {
        // Refresh the table by refetching the container data
        axios
          .get('http://localhost:8081/')
          .then(res => setContainer(res.data))
          .catch(err => console.log(err));
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:8081/')
      .then(res => setContainer(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='main-content'>
      <ContentTop />
      <div className="container">
        <Link to="/ContainerAdd" >Add container</Link>
        {openModal && <AddContainer closeModal={() => setOpenModal(false)} />}
        <table className="content-table">
          <thead >
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
          <tbody>
            {container.map((data, i) => (
              <tr className="active-row" key={i}>

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
        </table>
      </div>
    </div>
  );
}

export default Container;