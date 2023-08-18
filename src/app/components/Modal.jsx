import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 overflow-y-auto'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={onClose}></div>

      {/* Modal Content */}
      <div className='bg-white p-6 rounded-lg shadow-lg relative z-10 w-96 max-h-full overflow-y-auto'>
        {children}
        <button className='absolute top-2 right-2 text-xl' onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;