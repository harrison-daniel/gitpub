import React from "react";

import { FaWindowClose } from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex w-auto justify-center overflow-y-auto text-center ">
      {/* Overlay */}
      <div
        className="absolute inset-0  bg-black opacity-50"
        onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative z-10   max-h-full w-auto   overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
