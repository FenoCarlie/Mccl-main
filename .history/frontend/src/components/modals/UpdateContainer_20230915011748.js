import React from 'react'

function UpdateContainer({closeModal}) {
  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <button onClick={() => closeModal(false)}> X </button>
            <div className='modalTitle'>
                <h1>Update a new Container</h1>
            </div>
            <div className='modalBody'>
                <h1>The input form</h1>
            </div>
            <div className='modalFooter'>
                <button>Booking</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateContainer