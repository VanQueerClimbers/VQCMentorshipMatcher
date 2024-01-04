import React, { useState, useEffect, useRef} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: ()=>void;
  children: any[];
}

const Modal = ({ isOpen, onClose, children } : ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [isOpen])

  if (!isOpen) return null;

  const handleEsc = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <dialog ref={ref} className="fixed top-0 left-0 w-full h-full flex items-center justify-center" onKeyDown={handleEsc}>
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
    </dialog>
  );
};

export default Modal;
