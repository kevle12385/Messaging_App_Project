import React, {useState, useEffect} from 'react'
import LogoutButton from './Logout'
import Navigation from './Navigation';
import { refreshAccessToken } from '../AuthService'; 
import axios from 'axios';
import Chatroom from './Chatroom';
import('../CSS/ChatApplication.css')
import { useAuth } from '../AuthContext.jsx'
import CreateChatModal from './CreateChatModal.jsx';

function Dashboard() {
  const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Initially, data is loading

  const [friendList, setFriendList] =  useState([]);
  const [userId, setUserId] =  useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [chatNames, setChatNames] = useState([]);
  const [chatRooms, setChatRooms] =  useState([]);
  const [chatUpdateCount, setChatUpdateCount] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [foundMessages, setFoundMessages] = useState([]);

  

  

  const handleSelect = (_id) => {
    // Update the selected room ID
    setSelectedId(_id);
  
    // Find the chat room by _id and set its messages to the state
    const selectedRoom = chatNames.find(room => room._id === _id);
    if (selectedRoom) {
      // This sets foundMessages to be the array of message objects
      setFoundMessages(selectedRoom.messages);
    } else {
      setFoundMessages([]);
    }
  
  };
  

                                      
  

  const showFriends = async () => {
    try {
      const userID = await fetchUserIdFromEmail();
      // Step 1: Fetch the list of friend IDs
      let response = await axios.post('/api/showFriendList', { userID: userID });
      const friendIDs = response.data.friends; // Assuming the endpoint returns an object with a 'friends' property that is an array of IDs
      console.log(friendIDs)
      // Step 2: Fetch detailed information for each friend
      if (friendIDs && friendIDs.length > 0) {
        response = await axios.post('/api/friendsDetails', { friends: friendIDs });
        const friendDetails = response.data; // This should be the array of friend objects with detailed information
        setFriendList(friendDetails); // Update your state with the detailed friend information
        console.log(friendDetails)
      } else {
        setFriendList([]); // Handle the case where there are no friends
      }
    } catch (error) {
      console.error('Error returning Friend List:', error);
    }
  };

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

 

  const displayChat = async () => {
    const userId = await fetchUserIdFromEmail();
    try {
      const response = await axios.post('/api/showChatRooms', {userId});
      
      setChatRooms(response.data); // Assuming response.data is the direct structure you want
      console.log('Chat rooms found:', response.data);
      
      // After successfully updating chatRooms, call findChatNames
      findChatNames();
    } catch (error) {
      console.error('Error finding Chatrooms:', error);
      // Inform the user of the error, for example:
      // setErrorMessage('Failed to create chat room. Please try again.');
    }
  };
  

  const findChatNames = () => {
    if (Array.isArray(chatRooms?.chatRooms)) {
      const chatData = chatRooms.chatRooms.map(room => {
        const name = room.names[0] === currentUser
          ? room.names[1] ?? room.names[0]
          : room.names[0];
  
        // Simply return the name, _id, and messages for now
        return { name, _id: room._id, messages: room.messages };
      });
  
      // Update the chat names based on the mapped data
      setChatNames(chatData);
  
      // Find and set messages for the selected room separately
     
      const selectedRoom = chatData.find(room => room._id === selectedRoomId);
      if (selectedRoom) {
        setChatMessages(selectedRoom.messages);
      }
    } else {
      // Handle the case where there are no chat rooms
      setChatNames([]);
      setChatMessages([]); // Ensure chat messages are cleared if no rooms are found
    }
  };
  
  
    
    
    





  useEffect(() => {
    if (isLoggedIn) { 
      async function loadData() {
        try {
          await Promise.all([showFriends(),findChatNames()]); // Just wait for this single async function to resolve
          setIsLoading(false); // Set loading to false after data fetching
        } catch (error) {
          console.error('Error loading data:', error);
          setIsLoading(false); // Also set loading to false in case of error
        }
      }
    


      loadData();
    } else {
      const email = fetchCookieEmail();
      if (email) {
        setIsLoggedIn(true); // or update your auth context/state accordingly
      } else {
        navigate('/login');
      }
    }
  }, [isLoggedIn]); // Depend on the authentication state
  
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && chatUpdateCount < 5) {
        await displayChat();
        setChatUpdateCount(prev => prev + 1); // Increment the counter
      }
    };
  
    fetchData();
  }, [isLoggedIn, chatUpdateCount]); // Now depends on isLoggedIn and chatUpdateCount
  
  


  return (
    <div>
      <Navigation /> 
      <div className="container">

        <div className="content">
          <div className='dashboard_title'>         
             <h1>Chats</h1> 
             <CreateChatModal className='createChatButton'/>
          </div>
          <div>
      {isLoading ? (
        <div>Loading chat rooms...</div>
      ) : (
        chatNames.map(({ _id, name }) => (
          <div
            key={_id}
            onClick={() => handleSelect(_id)}
            className={`chatItem ${selectedId === _id ? 'chatItemSelected' : ''}`}
          >
            {name}
          </div>
        ))
      )}
    </div>
      </div>
        <div className='chatroom_Component'>
          <Chatroom selectedId={selectedId} foundMessages={foundMessages}/>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboard