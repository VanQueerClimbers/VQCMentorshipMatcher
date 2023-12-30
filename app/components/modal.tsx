import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: ()=>void;
  children: any[];
}

const Modal = ({ isOpen, onClose, children } : ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="absolute bg-gray-800 opacity-75 inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 z-10 divide-y divide-solid divide-purple-900 max-h-full overflow-y-auto">
        {children}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
