import React, {useState, useEffect} from 'react'
import Navigation from './Navigation'
import axios from 'axios' 
import { useNavigate } from 'react-router-dom';

function Friends() {
  const navigate = useNavigate();

  const [friends, setFriends] =  useState([]);
  const [userId, setUserId] =  useState('');
  const [personID, setPersonID] =  useState('');
  const [email, setEmail] =  useState('');
  const [friendRequests, setFriendRequests] =  useState([]);


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
  
  // const findFriendRequests = async () => {
  //   try {
  //     const userID = await fetchUserIdFromEmail();
  //     const response = await axios.post('/api/findFriendRequests', {userID: userID})
  //     setFriendRequests(response.data)
  //     console.log(friendRequests)
  //     const requestFromIds = response.data.map(request => request.RequestFrom);
  //   console.log(requestFromIds); // Logs an array of 'RequestFrom' IDs

  //   } catch (error) {

  //   }
  // }

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
  

  const fetchFriends = (Email) => {
    Email = fetchCookieEmail();
    axios.get(`/api/people?excludeEmail=${Email}`)
    .then(response => {
      setFriends(response.data);
      console.log(friends)
    }) .catch(error => {
      console.error('There was an error fetching the names:', error);
    });
    
  }

  useEffect(() => {
    const email = fetchCookieEmail();
    if (!email) {
      navigate('/login');
    } else {
      fetchFriends();
      showfriendRequests();
    }
  }, []);
  
  
const showfriendRequests = async () => {

 try {
  const userID = await fetchUserIdFromEmail();

  const response = await axios.post('api/enrichedFriendRequests', {userID: userID})
  setFriendRequests(response.data)
  console.log(friendRequests)
  console.log(friends);

} catch (error) {
  console.error('There was an error fetching the friend requests:', error);

}
}


  return (
<>
<Navigation/>
<div>

</div>

<h1>Friend Requests</h1>
<h2>Add Friends:</h2>

{friendRequests.map((person, index) => (
  <label key={index}> {/* Consider using person._id as key if it's unique */}
    <input 
      type="radio" 
      name="personName" 
      value={person._id} 
      onClick={() => setPersonID(person._id)} 
    />
    {person.requesterDetails?.name || 'Unknown'}<br/>
  </label>
))}

<form>
        

<button>Accept</button>
<button>Decline</button>

</form>

<h1>Discover People </h1>

<form>
{friends.map((person, index) => (
            <label key={index}>
              <input type="radio" 
              name="personName" 
              value={person._id} 
              onClick={() => setPersonID(person._id)} />
              {person.name}<br/>
            </label>
          ))}


<button onClick={onSubmitsendFriendRequest}>Add Friend</button>

</form>
<button onClick={fetchUserIdFromEmail}>Test</button>
<button onClick={showfriendRequests}>Super test</button>
</>  
  )
}

export default Friends