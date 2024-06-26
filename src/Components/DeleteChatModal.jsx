import React, { useState } from 'react';
import DeleteChatContent from './DeleteChatContent'; 
import "../CSS/Modal.css";

function DeleteChatModal({setchatObject, chatObject, findChatObject, selectedId, setSelectedId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  
  return (
    <div>
      <button className='button1'onClick={openModal}>Delete Chat</button>
      
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
          <DeleteChatContent onClose={closeModal}findChatObject={findChatObject} setSelectedId={setSelectedId} selectedId={selectedId}  chatObject={chatObject} setchatObject={setchatObject} />

          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteChatModal;