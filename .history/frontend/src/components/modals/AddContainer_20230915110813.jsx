import { useState } from 'react';
import PropTypes from 'prop-types';

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
      const response = await fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data added successfully');
        // Close the modal
        closeModal();
      } else {
        console.log('An error occurred');
      }
    } catch (err) {
      console.error('Error:', err);
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