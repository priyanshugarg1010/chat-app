import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Cookies from "universal-cookie";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../slice/authSlice";

const cookies = new Cookies();

const Navbar = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    dispatch(setAuth(false));
  };

  return (
    <nav>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chat App
            </Typography>
            {isAuth && (
              <Button onClick={signUserOut} color="inherit">
                Sign Out
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </nav>
  );
};

export default Navbar;
