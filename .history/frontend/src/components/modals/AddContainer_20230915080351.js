import React from 'react';

function AddContainer({ closeModal }) {
  return (
    <div className='modalBackground'>
      <div className='modalContainer'>
        <button onClick={() => closeModal(true)}>X</button>
        <div className='modalTitle'>
          <h1>Add a New Container</h1>
        </div>
        <div className='modalBody'>
          {/* You can add your input form here */}
          <h1>The input form</h1>
        </div>
        <div className='modalFooter'>
          <button>Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddContainer;
