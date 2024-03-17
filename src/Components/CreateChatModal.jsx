import React, { useState } from 'react';
import CreateChatRoomContent from './CreateChatRoomContent';
import "../CSS/Modal.css";

function CreateChatModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button className='button1'onClick={openModal}>New Chat</button>
      
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <CreateChatRoomContent onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateChatModal;