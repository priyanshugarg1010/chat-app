import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import Cookies from "universal-cookie";
import { db, auth, provider } from "../config/firebaseConfig";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import cuid from "cuid";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Carousel from "../components/Carousel";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { setLinkId } from "../slice/linkSlice";

const cookies = new Cookies();

export const Auth = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const linkId = useSelector((state) => state.link.linkId);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [meetCode, setMeetCode] = useState("");

  const handleStart = async () => {
    if (isAuth) {
      navigate(`/chat/${linkId}`);
    } else {
      toast.error("Please Sign In");
      return;
    }
  };

  const handleJoin = async () => {
    if (isAuth) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("linkId", "==", meetCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Invalid meeting code. Please check and try again.");
        } else {
          dispatch(setLinkId(meetCode));
          navigate(`/chat/${meetCode}`);
        }
      } catch (error) {
        console.error("Error checking meeting code:", error);
        setError(
          "An error occurred while checking the meeting code. Please try again."
        );
      }
    } else {
      toast.error("Please Sign In");
      return;
    }
  };
  const handleCopy = () => {
    if (linkId == null) {
      toast.error("Please Sign In");
      return;
    }
    navigator.clipboard.writeText(linkId).then(
      () => {
        toast.success("Code copied");
      },
      (err) => {
        toast.error("Failed to copy!");
      }
    );
  };

  return (
    <div className="">
      <Box>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
              xl: "row",
            },
          }}
        >
          <Grid item>
            <Container maxWidth="md">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                  minHeight: "100vh",
                  textAlign: "start",
                  paddingX: "40px",
                }}
              >
                <Typography variant="h3" gutterBottom>
                  Connect with Ease. Chat with Everyone.{" "}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  color={"grey"}
                  fontSize={"18px"}
                >
                  Our chat app provides a seamless and secure way to stay in
                  touch with friends, family, and colleagues.
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "start",
                      gap: "10px",
                      justifyContent: "start",
                      marginTop: "4em",
                      paddingX: 0,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={handleStart}
                      sx={{ display: "flex", gap: 1, paddingY: "7.5px" }}
                    >
                      <ChatIcon /> Start New Chat
                    </Button>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Enter meeting code"
                        fullWidth
                        size="small"
                        value={meetCode}
                        onChange={(e) => setMeetCode(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <KeyboardIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={handleJoin}
                        disabled={!meetCode}
                      >
                        Join
                      </Button>
                    </Box>
                  </Box>
                  {error && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1em",
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <Divider sx={{ marginY: "1em" }} />
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    onClick={handleCopy}
                    sx={{ display: "flex", gap: 1, paddingY: "7.5px" }}
                  >
                    Copy Meeting Code <ContentCopyIcon />
                  </Button>
                </Box>
              </Box>
            </Container>{" "}
          </Grid>
          <Grid item>
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                marginTop: {
                  xs: 0,
                  sm: 0,
                  md: 0,
                  lg: "200px",
                  xl: "200px",
                },
              }}
            >
              <Carousel />
            </Container>{" "}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
