import React from 'react'

function AddContainer() {
  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <button> X </button>
            <div className='modalTitle'>
                <h1>Add a new Container</h1>
            </div>
            <div className='modalBody'></div>
            <div className='modalFooter'></div>
        </div>
    </div>
  )
}

export default AddContainer