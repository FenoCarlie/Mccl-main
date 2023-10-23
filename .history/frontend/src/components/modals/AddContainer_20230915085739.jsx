import React, { useState } from 'react';

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
    <div className="modal" >
      <div className="modal-dialog">
        <button onClick={() => closeModal(true)}>X</button>
        <div className="modalTitle">
          <h1>Add a New Container</h1>
        </div>
        <div className="modalBody">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Container Number:</label>
              <input
                type="text"
                name="num_container"
                value={formData.num_container}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            {/* Add more form fields here */}
            <div className="modalFooter">
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddContainer;
