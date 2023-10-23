import { useEffect, useState } from "react";
import axios from "axios"; // Import axios

import ContentTop from "../ContentTop/ContentTop";
import AddContainer from "../modals/AddContainer";

const Container = () => {
  const [container, setContainer] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Fetch container data when the component mounts
    axios
      .get('http://localhost:8081/')
      .then(res => setContainer(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='main-content'>
      <ContentTop />
      <div className="container">
        <button className="button_add" onClick={() => setOpenModal(true)}>
          Add
        </button>
        {openModal && <AddContainer setOpenModal={setOpenModal} />}
        <table className="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">Container number</th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Live</th>
              <th scope="col">Code of location T.P</th>
              <th scope="col">Position</th>
              <th scope="col">Entry date</th>
              <th scope="col">Release date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
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
                  <button className="btn btn-danger">Delete</button>
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
