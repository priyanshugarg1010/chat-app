import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  ListItemText,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import { db, auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import cuid from "cuid";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  query,
  addDoc,
} from "firebase/firestore";
import { setLinkId } from "../slice/linkSlice";
import { useParams } from "react-router-dom";

function Chats() {
  const dispatch = useDispatch();
  const { chatId } = useParams();

  useEffect(() => {
    if (chatId) {
      dispatch(setLinkId(chatId));
    }
  }, [chatId, dispatch]);
  const linkId = useSelector((state) => state.link.linkId);
  const emailId = useSelector((state) => state.email.emailId);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    if (chatId) {
      const chatDocRef = doc(db, "chats", chatId);
      const messagesCollectionRef = collection(chatDocRef, "messages");
      const q = query(messagesCollectionRef, orderBy("createdAt"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            setMessages([]);
          } else {
            const msgs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(msgs);
          }
        },
        (error) => {
          console.error("Error fetching messages: ", error);
          setMessages([]);
        }
      );

      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.linkId) {
            dispatch(setLinkId(userData.linkId));
          } else {
            const newLinkId = cuid();
            dispatch(setLinkId(newLinkId));
            await setDoc(
              userDocRef,
              {
                linkId: newLinkId,
                email: user.email,
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (chatId && auth.currentUser) {
      fetchMessages();
    }
  }, [chatId, auth.currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      console.error("No authenticated user.");
      return;
    }

    try {
      if (!newMessage) {
        return;
      }
      const chatDocRef = doc(db, "chats", chatId);
      const messagesCollectionRef = collection(chatDocRef, "messages");
      await addDoc(messagesCollectionRef, {
        message: newMessage,
        sender: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  if (!chatId) {
    return (
      <Container
        sx={{
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          marginTop: "70px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: "60vh",
          }}
        >
          <Typography variant="h3" gutterBottom>
            You're Not Signed In
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            color={"grey"}
            fontSize={"18px"}
          >
            Please Sign In First
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "70px",
      }}
    >
      <Paper sx={{ flex: 1, margin: "1em 0", overflowY: "auto" }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent:
                  message.sender == emailId ? "flex-end" : "flex-start",
              }}
            >
              <ListItemText
                sx={{
                  textAlign: message.sender == emailId ? "right" : "left",
                  backgroundColor:
                    message.sender == emailId ? "#e0f7fa" : "#fff9c4",
                  padding: "1em",
                  borderRadius: "8px",
                  maxWidth: "75%",
                  height: "auto",
                  wordBreak: "break-word",
                }}
                primary={message.message}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Type a message"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={sendMessage}
          sx={{ marginLeft: "1em" }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
}

export default Chats;
