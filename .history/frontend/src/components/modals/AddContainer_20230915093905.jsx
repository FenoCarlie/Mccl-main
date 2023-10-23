import { useState } from 'react';
import PropTypes from 'prop-types';

function AddContainer({ closeModal }) {
  const [formData, setFormData] = useState({
    num_container: '',
    type: '',
    category: '',
    // Add more fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send formData to the server
    console.log('Form data:', formData);

    // Close the modal
    closeModal(true);
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <button onClick={() => closeModal(true)}>X</button>
        <div className="modalTitle">
          <h1>Add a New Container</h1>
        </div>
        <div className="modalBody">
          <form onSubmit={handleSubmit}>
            <div className='in_group'>
              <label>
                Container Number:
                <input
                  className='in_control'
                  type='text'
                  name='num_container'
                  value={formData.num_container}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='in_group'>
              <label>
                Type:
                <input
                  className='in_control'
                  type='text'
                  name='type'
                  value={formData.type}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='in_group'>
              <label>
                Category:
                <input
                  className='in_control'
                  type='text'
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                />
              </label>
            </div>
            {/* Add more input fields for additional columns */}
            {/* Use the same pattern for value, name, and onChange for each input field */}
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