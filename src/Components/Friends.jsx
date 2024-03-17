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
  const [friendList, setFriendList] =  useState([]);


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
  

  const onSubmitsendFriendRequest = async (personID) => {

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
      alert('Friend Requst Already Made');
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
  

  const acceptFriendRequest = async (personId) => {
    // Prevents the form from submitting traditionally, if this function is used in an `onClick` handler with a button inside a form
    // e.preventDefault();
  
    try {
      const userID = await fetchUserIdFromEmail(); 
      const RequestFrom = personId; // Now directly using the passed personId
      const response = await axios.post('/api/acceptFriendRequestDoc', {
        RequestFrom: RequestFrom,
        userID: userID,
      });
  
      console.log(response.data);
      // Filter out the accepted request from the friendRequests state
      const updatedFriendRequests = friendRequests.filter(request => request.requesterDetails._id !== RequestFrom);
      setFriendRequests(updatedFriendRequests);
  
      // Conditional based on your API's response structure
      if (response.data.acknowledged && response.data.deletedCount > 0) {
        await showfriendRequests(); // Re-fetches and updates the friend requests list
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('There was an error accepting the friend request.');
    }
  };
  

  const deleteFriendRequest = async (personId) => {
    try {
      const userID = await fetchUserIdFromEmail();
      const RequestFrom = personId;
  
      const response = await axios.post('/api/deleteFriendRequestDoc', {
        RequestFrom: RequestFrom,
        userID: userID,
      });
  
      console.log(response.data);
      // This assumes each friend request is uniquely identified by the requester's _id in your friendRequests state array.
      const updatedFriendRequests = friendRequests.filter(request => request.requesterDetails._id !== RequestFrom);
      setFriendRequests(updatedFriendRequests);
  
      if (response.data.acknowledged && response.data.deletedCount > 0) {
        await showfriendRequests(); // Optionally, refresh the friend requests list
      } else if (response.data.acknowledged && response.data.deletedCount == 0) {
        alert('The request was not found or had already been declined.');
      }
    } catch (error) {
      console.error('Error deleting friend request:', error);
      alert('An error occurred while trying to decline the friend request.');
    }
  };
  
  const deleteFriend = async (personId) => {
    try {
      const userID = await fetchUserIdFromEmail();
      const friendID = personId;
      const response = await axios.post('/api/friends/remove', {
        friendID: friendID,
        userID: userID,
      });
      console.log(response.data);
      const updatedFriendList = friendList.filter(request => request._id !== friendID);
      setFriendList(updatedFriendList);
    } catch (error) {
      console.error('Error deleting friend:', error);
      alert('An error occurred while trying to delete a friend.');
    }
  }
  
  

  useEffect(() => {
    console.log(personIDToDelete); // Log the current state to verify it's being updated
  }, [personIDToDelete]);
  

  useEffect(() => {
    if (isLoggedIn) { 
      async function loadData() {
        try {
          // Assuming fetchFriends and showfriendRequests are async and return Promises
          await Promise.all([fetchPeople(), showfriendRequests(), showFriends()]);
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

  return (
   <> 
    <Navigation/>
    <h1>Loading...</h1>;
  </> )
}

return (
<>
  <Navigation/>
  <div className="container-friends">
    <div className="section-friends">
      <div className='Friends-container'>
        <h1 className='main_item'>Friends</h1>

      
{friendList.map((person) => (
  <div key={person._id} className="friend">
    <span className="person-name">{person?.name || 'Unknown'}</span>
    <button onClick={() => deleteFriend(person._id)} className="button2">Delete</button>   
  </div>
))}

      </div>
    </div>
      <div className="section-friends">
        <div className='FriendRequests-container'>
        <div className='FriendRequests-container'>
  <h1 className='main_item'>Friend Requests</h1>
  {friendRequests.map((person, index) => (
    <div key={index} className="friend-request">
      <span className="person-name">{person.requesterDetails?.name || 'Unknown'}</span>
      <button onClick={() => acceptFriendRequest(person.requesterDetails._id)} className="button2">Accept</button>
      <button onClick={() => deleteFriendRequest(person.requesterDetails._id)} className="button2">Decline</button>
    </div>
  ))}
  {friendRequests.length === 0 && (
    <span className="person-name">You're all caught up! Why not invite your friends to join!</span>
  )}
</div>

      </div>
    </div>

    <div className="section-friends">
      <div className="DiscoverFriends-container">
      <h1 className='main_item'>Discover People</h1>
      
  {friends.map((person, index) => (
    <div key={index} className="friend-request-item">
      <span className="person-name">{person.name}</span>
      <button type="button" onClick={() => onSubmitsendFriendRequest(person._id)} className="button2">Add Friend</button><br/>
    </div>
  ))}
      </div>
    </div>
   
  </div>
</>

  );
}
export default Friends