// Modal.js
import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div  onClick={e => e.stopPropagation()}>
        {children}
       
      </div>
    </div>,
    document.body
  );
};

export default Modal;
