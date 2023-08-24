import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex w-auto justify-center overflow-y-auto  text-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative z-10  max-h-full    overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {children}

        <button className="absolute right-2 top-2  text-4xl" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
