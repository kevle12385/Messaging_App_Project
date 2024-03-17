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

  function selectPerson(id) {
    setSelectedPersonId(id);
    console.log(selectedPersonId)
  }
  

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
  

     const findChatNames =  () => {
      // Check if chatRooms.chatRooms is defined and is an array
      if (Array.isArray(chatRooms?.chatRooms)) {
        const names = chatRooms.chatRooms.map(room => {
          // Check if the current user's name matches the first name in the names array of the room
          if (room.names[0] === currentUser) {
            // If it matches, and there's another name, return that name, otherwise, return the first name
            return room.names[1] ?? room.names[0];
          } else {
            // If it doesn't match, return the first name
            return room.names[0];
          }
        });
        // Update the state with the names found
        setChatNames(names);
      } else {
        // If chatRooms.chatRooms is not an array, set chatNames to an empty array or any other default value
        setChatNames([]);
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
  
          </div>
          <button >test </button>
          {isLoading ? (
        <div>Loading chat rooms...</div>
      ) : (

        chatNames.map((name, index) => (
          <div key={index}>{name}</div>

        ))
      )}
          <CreateChatModal/>
          <div>
  </div>
        

        </div>
        <div className="chatroom">
          <Chatroom/>
          {isLoading ? (
        <div>Loading chat rooms...</div>
      ) : (
        <div>{chatRooms.chatRooms[0].names[0]}</div>
        
      )}
      {isLoading ? (
        <div>Loading chat rooms...</div>
      ) : (

        chatNames.map((name, index) => (
          <div key={index}>{name}</div>

        ))
      )}
        <button onClick={() => {
          console.log(chatRooms.chatRooms[0].names[0])
        }}>print name</button>
        </div>
      </div>

    </div>
  );
  
}

export default Dashboard