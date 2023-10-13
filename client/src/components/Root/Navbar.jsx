import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import {Menu, MenuItem} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";


const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setCurrentUser(null); // clear the current user in context
      navigate("/login"); // redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
    

  return (
    <AppBar position="static" sx={{ height: "8vh" }} elevation={0}>
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          paddingTop="10px"
        >
          <Button color="inherit" onClick={() => navigate("/")}>
            <Typography variant="h6" component="div">
              BrownLabs
            </Typography>
          </Button>
          {currentUser ? (
          <div>
            <Button color="inherit" onClick={handleClick}>
              <Box>
                <Typography variant="body3">{currentUser.displayName}</Typography>
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem onClick={() => navigate("/account")}>Account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Signup
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
