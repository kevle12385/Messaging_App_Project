import React, { useState } from 'react';
import CreateChatRoomContent from './CreateChatRoomContent';
import "../CSS/Modal.css";

function CreateChatModal({displayChat,fecthChatRoomData,  findChatNames,setChatNames,setchatObject,chatObject,  chatNames, selectedId, setSelectedId, findChatObject}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button className='button1'onClick={openModal}>New Chat</button>
      
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <CreateChatRoomContent onClose={closeModal} chatObject={chatObject}setchatObject={setchatObject}fecthChatRoomData={fecthChatRoomData} displayChat={displayChat} setChatNames={setChatNames} setSelectedId={setSelectedId} selectedId={selectedId} chatNames={chatNames}findChatNames={findChatNames} findChatObject={findChatObject}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateChatModal;