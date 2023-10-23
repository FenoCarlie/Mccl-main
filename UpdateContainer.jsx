import { useState } from 'react';
import PropTypes from 'prop-types';


function UpdateContainer({ closeModal }) {
  const [formData, setFormData] = useState({
    num_container: '',
    type: '',
    category: '',
    // Add more fields as needed
  });

  return (
    <div className='modalBackground'>
      <div className='modalContainer'>
        <button onClick={() => closeModal(true)}>X</button>
        <div className='modalTitle'>
          <h1>Update a Container</h1>
        </div>
        <div className='modalBody'>
          {/* You can add your input form here */}
          <h1>The input form</h1>
        </div>
        <div className='modalFooter'>
          <button>Update</button>
        </div>
      </div>
    </div>
  );
}

UpdateContainer.propTypes = {
  closeModal: PropTypes.func.isRequired, // Assuming closeModal is a function
};

export default UpdateContainer;
