import React from 'react';

function AddContainer({ closeModal }) {
  return React.createElement('div', { className: 'modalBackground' },
    React.createElement('div', { className: 'modalContainer' },
      React.createElement('button', { onClick: () => closeModal(true) }, 'X'),
      React.createElement('div', { className: 'modalTitle' },
        React.createElement('h1', null, 'Add a New Container')
      ),
      React.createElement('div', { className: 'modalBody' },
        React.createElement('h1', null, 'The input form')
      ),
      React.createElement('div', { className: 'modalFooter' },
        React.createElement('button', null, 'Add')
      )
    )
  );
}

export default AddContainer;
