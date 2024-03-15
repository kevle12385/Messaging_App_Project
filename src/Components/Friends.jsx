import React, {useState, useEffect} from 'react'
import Navigation from './Navigation'
import axios from 'axios' 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx'
import '../CSS/Friends.css'

function Friends() {
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn  } = useAuth();

  const [friends, setFriends] =  useState([]);
  const [userId, setUserId] =  useState('');
  const [personID, setPersonID] =  useState('');
  const [friendRequests, setFriendRequests] =  useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initially, data is loading
  const [personIDToDelete, setPersonIDToDelete] = useState(true); // Initially, data is loading


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
  

  const onSubmitsendFriendRequest = async (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally
    try {
    const userID = await fetchUserIdFromEmail(); // Assuming fetchUserIdFromEmail is a function that returns the user ID
    if (!userID) {
      alert('Email cookie not found');
      return null; // Early return if Email is not found in cookies
    }
    if (!personID) {
      alert('Person ID  not found');
      return null; // Early return if Email is not found in cookies
    }

  
      console.log("userid" + userID)

      const response = await axios.post('/api/friends/sendRequest', {FriendID: personID, AdderID: userID});
      // Handle response here if needed
    } catch (error) {
      alert('There was an error making friend request');
      console.log(personID)
      console.log("userid" + userID)

    }
  }
  

  const fetchPeople = (Email) => {
    Email = fetchCookieEmail();
    axios.get(`/api/people?excludeEmail=${Email}`)
    .then(response => {
      setFriends(response.data);
    }) .catch(error => {
      console.error('There was an error fetching the names:', error);
    });
    
  }


  const acceptFriendRequests = async (e) => {
    e.preventDefault();
  
  
    try {
      const userID = await fetchUserIdFromEmail(); 
      const RequestFrom = personIDToDelete;
      const response = await axios.post('/api/acceptFriendRequestDoc', {
        RequestFrom: RequestFrom,
        userID: userID,
      });
     
      console.log(response.data);
      const updatedFriendRequests = friendRequests.filter(request => request._id !== RequestFrom);
      setFriendRequests(updatedFriendRequests);

      if (response.data.acknowledged && response.data.deletedCount > 0) {
        await showfriendRequests(); // Refresh the friend requests list
      }
    } catch (error) {
      console.error('Error deleting friend request:', error);
      alert('No Request Selected to Accept');

    }
  };

  const deleteFriendRequests = async (e) => {
    e.preventDefault();
    try {
      const userID = await fetchUserIdFromEmail(); 
      const RequestFrom = personIDToDelete;
  
      const response = await axios.post('/api/deleteFriendRequestDoc', {
        RequestFrom: RequestFrom,
        userID: userID,
      });
  
      console.log(response.data);
      const updatedFriendRequests = friendRequests.filter(request => request._id !== RequestFrom);
      setFriendRequests(updatedFriendRequests);

      if (response.data.acknowledged && response.data.deletedCount > 0) {
        await showfriendRequests(); // Refresh the friend requests list
      }
      if (response.data.acknowledged && response.data.deletedCount == 0) {
        alert('No Request Selected to Decline');
      }
    } catch (error) {
      console.error('Error deleting friend request:', error);
      alert('No Request Selecte to Decline');

    }
  };
  
  
    

  useEffect(() => {
    console.log(personIDToDelete); // Log the current state to verify it's being updated
  }, [personIDToDelete]);
  

  useEffect(() => {
    if (isLoggedIn) { 
      async function loadData() {
        try {
          // Assuming fetchFriends and showfriendRequests are async and return Promises
          await Promise.all([fetchPeople(), showfriendRequests()]);
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

  
const showfriendRequests = async () => {
 try {
  const userID = await fetchUserIdFromEmail();

  const response = await axios.post('api/enrichedFriendRequests', {userID: userID})
  setFriendRequests(response.data)


} catch (error) {
  console.error('There was an error fetching the friend requests:', error);

}
}


if (isLoading) {
  return <h1>Loading...</h1>; // Or any loading spinner component
}

return (
<>
  <Navigation/>
  <div className="container-friends">
    <div className="section-friends">
      <div className='Friends-container'>
        <h1>Friends</h1>
        {/* Your friends list or related content goes here */}


        
      </div>
    </div>
      <div className="section-friends">
        <div className='FriendRequests-container'>
         <form>
          <h1>Friend Requests</h1>
          {friendRequests.map((person, index) => (
            <label key={index}>
              <input 
                type="radio" 
                name="personName" 
                value={person.requesterDetails._id} 
                onChange={() => setPersonIDToDelete(person.requesterDetails._id)}
              />
              {person.requesterDetails?.name || 'Unknown'}<br/>
            </label>
          ))}
          {friendRequests && friendRequests.length > 0 ? (
            <>
              <button onClick={acceptFriendRequests}>Accept</button>
              <button onClick={deleteFriendRequests}>Decline</button>
            </>
          ) : (
            <div>None</div>
          )}
        </form>
      </div>
    </div>

    <div className="section-friends">
      <div className="DiscoverFriends-container">
        <form>
          <h1>Discover People</h1>
          {friends.map((person, index) => (
            <label key={index}>
              <input type="radio" name="personName"   value={person._id} onClick={() => setPersonID(person._id)} />
  <span className="person-name">{person.name}</span><br/>
            </label>
          ))}
          <button onClick={onSubmitsendFriendRequest}>Add Friend</button>
        </form>
      </div>
    </div>
   
  </div>
</>

  );
}
export default Friends