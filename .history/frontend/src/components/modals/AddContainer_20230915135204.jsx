import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Container from './../../../../.history/frontend/src/components/views/Container_20230914234505';

function AddContainer({ closeModal }) {
  const [formData, setFormData] = useState({
    num_container: '',
    type: '',
    category: '',
    status: '',
    live: '',
    date_in: '',
    date_out: '',
    id_cli: '',
    tp_name: '',
    code_location_tp: '',
    position: '',
    name_container: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8081/create', formData);
  
      console.log(response);
  
      // Close the modal
      setOpenModal(false);
  
      // Refresh the table by refetching the container data
      axios
        .get('http://localhost:8081/')
        .then(res => setContainer(res.data))
        .catch(err => console.log(err));
    } catch (err) {
      console.error(err);
      // Handle the error as needed
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <button onClick={closeModal}>X</button> {/* Update the onClick event */}
        <div className="modalTitle">
          <h1>Add a New Container</h1>
        </div>
        <div className="modalBody">
          <form onSubmit={handleSubmit}>
          <div className='in_group'>
              <label>
                Container Number:
                <input className='in_control' type='text' name='num_container' value={formData.num_container} onChange={handleChange}
                />
              </label>
            </div>
            <div className='in_group'>
              <label>
                Name of Container:
                <input className='in_control' type='text' name='name_container' value={formData.name_container} onChange={handleChange}
                />
              </label>
            </div>
            <div className='in_group'>
              <label>
                Type:
                <input className='in_control' type='text' name='type' value={formData.type} onChange={handleChange}
                />
              </label>
            </div>
            <div className='in_group'>
              <label>
                Category:
                <input className='in_control' type='text' name='category' value={formData.category} onChange={handleChange}
                />
              </label>
            </div>
              <div className='in_group'>
              <label>
              Status:
                <input className='in_control' type='text' name='status' value={formData.status} onChange={handleChange}
                />
              </label>
              </div>
              <div className='in_group'>
              <label>
              Live:
                <input className='in_control' type='text' name='live' value={formData.live} onChange={handleChange}
                />
              </label>
              </div>
              <div className='in_group'>
              <label>
              Code of location T.P:
                <input className='in_control' type='text' name='code_location_tp' value={formData.code_location_tp} onChange={handleChange}
                />
              </label>
              </div>
              <div className='in_group'>
              <label>
              Position:
                <input className='in_control' type='text' name='position' value={formData.position} onChange={handleChange}
                />
              </label>
              </div>
              <div className='in_group'>
              <label>
                Entry date:
                <input className='in_control' type='date' name='date_in' value={formData.date_in} onChange={handleChange}
                />
              </label>
            </div>
              <div className='in_group'>
              <label>
                Release date:
                <input className='in_control' type='date' name='date' value={formData.date_out} onChange={handleChange}
                />
              </label>
            </div>
            <button type="submit">Add Data</button>
          </form>
        </div>
      </div>
    </div>
  );
}


AddContainer.propTypes = {
  closeModal: PropTypes.func.isRequired, // Assuming closeModal is a function
};

export default AddContainer;