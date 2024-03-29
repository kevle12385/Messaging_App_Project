import React, { useState } from 'react';
import DeleteChatContent from './DeleteChatContent'; 
import "../CSS/Modal.css";

function DeleteChatModal({displayChat, findChatNames,setChatNames, chatNames, selectedId, setSelectedId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  
  return (
    <div>
      <button className='button1'onClick={openModal}>Delete Chat</button>
      
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
          <DeleteChatContent onClose={closeModal} displayChat={displayChat} setChatNames={setChatNames} setSelectedId={setSelectedId} selectedId={selectedId}  chatNames={chatNames} findChatNames={findChatNames}/>

          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteChatModal;