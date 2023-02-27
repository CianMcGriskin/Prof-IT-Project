import React from 'react';
import Cookies from 'js-cookie';
function LogoutComponent() {
    
    function handleLogout() {
     // Delete the Auth cookie
     Cookies.remove('Auth');

     // Redirect the user to the / page
     window.location.href = "/";
    }

    return (
        <button onClick={handleLogout}>
          Logout
        </button>
    );
}

export default LogoutComponent;