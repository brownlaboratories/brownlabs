import React, { useState, useEffect, useContext, useRef } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { styled } from "@mui/system";
import { AuthContext } from "../../AuthContext";
import { ReactComponent as GoogleLogo } from "../../assets/google-logo.svg";
import { useNavigate } from "react-router-dom";
import GetStarted from "./GetStarted";

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Register = () => {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(AuthContext); // consume AuthContext to access setCurrentUser
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pwError, setPwError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [getStarted, setGetStarted] = useState(false);

  const auth = getAuth();

  const wasPreviouslyLoggedIn = useRef(false);
  
  useEffect(() => {
    if (currentUser) {
      wasPreviouslyLoggedIn.current = true;
    }
  }, []);

  useEffect(() => {
    if (wasPreviouslyLoggedIn.current && currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailSignup = async (event) => {
    event.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email.");
      setError(null);
      return;
    } else setEmailError(null);
    if (password.length < 6) {
      setPwError("Password should be at least 6 characters.");
      setError(null);
      return;
    } else setPwError(null);
    //TODO: Check mongodb to make sure username is unique
      // Check MongoDB to make sure username is unique
      try {
        const response = await fetch(`/api/users/username/${username}`);
        const data = await response.json();

        if (data.userExists) {
          setError("Username already exists.");
          return;
        }
    } catch (error) {
        console.error('Error:', error);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's profile
      await updateProfile(userCredential.user, {
        displayName: username, // replace 'username' with the actual username value
      });

      // setGetStarted(true);
      navigate("/get-started"); // Navigate to home page


      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userCredential.user.uid,
            username: username,
            email: email,
          }),
        });

        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
        } else {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
        setCurrentUser(userCredential.user); // manually update the currentUser state

      } catch (error) {
        console.error('Failed to create user:', error.message);
      }

    } catch (error) {
      // Firebase error handling
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email already in use.");
          break;
        case "auth/invalid-email":
          setError("Email address is not valid.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled.");
          break;
        case "auth/weak-password":
          setError("Password is not strong enough.");
          break;
        default:
          setError("An error occurred.");
          break;
      }
    }
  };

  const handleGoogleSignup = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    if (email && password && username && /\S+@\S+\.\S+/.test(email) && password.length >= 6) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email, password, username]);
  

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        // If the login is successful, user data will be in the result
        if (result.user) {
          console.log(result.user);
          setCurrentUser(result.user); // Update the currentUser state
  
          // Add user data to MongoDB
          try {
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: result.user.uid,
                username: result.user.displayName,
                email: result.user.email,
              }),
            });
  
            if (response.ok) {
              const jsonResponse = await response.json();
              console.log(jsonResponse);
            } else {
              const errorResponse = await response.json();
              throw new Error(errorResponse.message);
            }
          } catch (error) {
            console.error('Failed to create user:', error.message);
          }
  
          // Navigate to get started page
          // setGetStarted(true);
          navigate("/get-started");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);
  
  // if(getStarted) {
  //   console.log("get started")
  //   return <GetStarted />;
  // }
  

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <FormField>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          onClick={handleGoogleSignup}
          style={{ borderColor: "#333", color: "#333" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <GoogleLogo style={{ width: "20px", height: "20px" }} />
            <Typography>Sign Up with Google</Typography>
          </Box>
        </Button>
      </FormField>
      <form noValidate onSubmit={handleEmailSignup}>
        <FormField>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </FormField>
        <FormField>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
        </FormField>
        {emailError && <p>{emailError}</p>}
        <FormField>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
        </FormField>
        {pwError && <p>{pwError}</p>}
        <FormField>
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={isDisabled}>
            Sign Up with Email
          </Button>
        </FormField>

        {error && <p>{error}</p>}
      </form>
    </Container>
  );
};

export default Register;
