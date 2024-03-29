import React, {useState, useEffect} from 'react'
import "../CSS/Modal.css";
import { useAuth } from '../AuthContext.jsx'
import axios from 'axios';
import('../CSS/ChatApplication.css')

function DeleteChatContent({onClose ,chatObject, setchatObject, findChatObject, fecthChatRoomData, selectedId, setSelectedId}) {
    const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true); // Initially, data is loading
    const [userId, setUserId] =  useState('');
    const [feedback, setFeedback] = useState("");



    const handleSelect = (id) => {
        setSelectedId(id);
        console.log(selectedId);
    }
  
      
    const fetchCookieEmail = () => {
        if (!document.cookie) return null; // Early return if `document.cookie` is undefined or empty
      
        const cookies = document.cookie.split('; ');
        const emailCookie = cookies.find(cookie => cookie.startsWith('Email='));
        return emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : null;
      };
    
      const fetchUserIdFromEmail = async () => {
        try {
          const Email = fetchCookieEmail(); // Assuming fetchCookieEmail() correctly fetches the email
          const response = await axios.post('/api/UserID/get', { Email: Email });
          console.log(response.data);
          setUserId(response.data); // Assuming setUserId is a function that sets the user ID in your state
          return response.data; // Return the user ID for further use
    
        } catch (error) { // Corrected syntax error in catch block
          console.error('There was an error fetching the user ID:', error);
        }
      };
    
      
      const DeleteChat = async () => {
        
        const user2 = selectedId;
        

        try {
          const response = await axios.post('/api/deleteChatroom', {user2});
          
          if (response.data.message === "Chatroom deleted successfully") {
            setchatObject(prevRooms => prevRooms.filter(room => room._id !== user2));
            setFeedback("Chat room deleted successfully");
            setSelectedId(null);
            // await displayChat();
            onClose()
          
          } else {
            setFeedback("Failed to delete chat room.");
          }
          


        } catch (error) {
          console.error('Error deleting chat room:', error);
          

        }
      };
      
      




        useEffect(() => {
            if (isLoggedIn) { 
              async function loadData() {
                try {
                  // Ensure both displayChat and showFriends are called as functions
                  // and awaited together using Promise.all
                  await Promise.all([findChatObject()]);
                  setIsLoading(false); // Set loading to false after data fetching
                } catch (error) {
                  console.error('Error loading data:', error);
                  setIsLoading(false); // Also set loading to false in case of error
                }
              }
          
              loadData();
            }
          }, [isLoggedIn]); // Dependency array to control the effect's execution
          
      


  return (
    <>
        <div>Pick a Chat</div>

        <div>
      {!chatObject || chatObject.length == 0 ? (
        <div>Loading chat rooms...</div>
      ) : (
        chatObject.map(({ _id, name }) => (
          <div
            key={_id}
            onClick={() => handleSelect(_id)}
            chatObject={`chatItem ${selectedId === _id ? 'chatItemSelected' : ''}`}
          >
            {name}
          </div>
        ))
      )}
    </div>

        <button onClick={DeleteChat} chatObject='button1'>Delete Chat</button>

        <button chatObject='button1' onClick={onClose}>Close</button>
    </>
  )
}

export default DeleteChatContent;