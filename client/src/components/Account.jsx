import React, { useState, useContext } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Account = () => {
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();

    if (currentUser && password) {
      try {
        // Reauthenticate
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          password
        );
        await reauthenticateWithCredential(currentUser, credential);

        // Delete from MongoDB
        const response = await fetch(`/api/users/${currentUser.uid}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        // Delete from Firebase
        await deleteUser(currentUser);
        setCurrentUser(null);
        navigate("/register");
      } catch (error) {
        console.error("Failed to delete account:", error.message);
      }
    }
  };

  return (
    <div>
      <input type="password" onChange={handlePasswordChange} placeholder="Confirm Password" />
      <Button variant="contained" color="secondary" onClick={handleDeleteAccount}>
        Delete Account
      </Button>
    </div>
  );
};

export default Account;
