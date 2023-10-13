import React, { useState, useContext, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { styled } from "@mui/system";
import { AuthContext } from "../../AuthContext";
import { ReactComponent as GoogleLogo } from "../../assets/google-logo.svg";
import { useNavigate } from "react-router-dom";

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const Login = ({ source = "/home" }) => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    let userCredential;

    // Inline check for email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      const response = await fetch("/api/findUserByEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
        }),
      });

      if (response.ok) {
        const userEmail = await response.json();

        try {
          userCredential = await signInWithEmailAndPassword(
            auth,
            userEmail,
            password
          );
          setCurrentUser(userCredential.user);

          navigate(source);
        } catch (error) {
          setError(error.message);
        }
      } else {
        setError("Username not found");
      }
    } else {
      try {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setCurrentUser(userCredential.user);
        navigate(source);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider); // signInWithPopup returns userCredential if successful
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result.user) {
          console.log(result.user);
          navigate(source);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [auth, navigate]);

  return (
    <>
      <FormField>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          onClick={handleGoogleLogin}
          style={{ borderColor: "#333", color: "#333" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <GoogleLogo style={{ width: "20px", height: "20px" }} />
            <Typography>Log In with Google</Typography>
          </Box>
        </Button>
      </FormField>
      <form noValidate onSubmit={handleEmailLogin}>
        <FormField>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            type="email"
            label="Username or Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
        </FormField>
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
        <FormField>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Log In with Email
          </Button>
        </FormField>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export const LoginForm = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Typography
        component="h1"
        variant="h5"
        align="center"
        sx={{ padding: "30px" }}
      >
        Log In
      </Typography>
      <Login />
    </Container>
  );
};

export const PleaseLogin = ({ sourceTitle, sourceUrl }) => {
  return (
    <Container maxWidth="sm">
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ padding: "30px" }}
      >
        Login to access the {sourceTitle}
      </Typography>
      <Login source={sourceUrl} />
    </Container>
  );
};
