import React from 'react';

function CreateCookie() {

    function setCookie(name, value, daysToLive) {
        var cookie = name + "=" + encodeURIComponent(value);

        if (typeof daysToLive === "number") {
            cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
            cookie += "; path=/; secure; SameSite=Strict";
        }

        document.cookie = cookie;
    }

    function handleClick() {
        // Sets a cookie named 'user' with value 'John Doe' that expires in 7 days
        setCookie("user", "John Doe", 7);
    }

    return (
        <div>
            <button onClick={handleClick}>Create Cookie</button>
        </div>
    );
}

export default CreateCookie;
