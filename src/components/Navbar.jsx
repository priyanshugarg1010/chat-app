import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../slice/authSlice";
import { setLinkId } from "../slice/linkSlice";
import { setEmailId } from "../slice/emailSlice";
import GoogleIcon from "@mui/icons-material/Google";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { db, auth, provider } from "../config/firebaseConfig";
import cuid from "cuid";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const cookies = new Cookies();

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const emailId = useSelector((state) => state.email.emailId);

  const [open, setOpen] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      dispatch(setAuth(true));
      dispatch(setEmailId(result.user.email));
    } catch (err) {
      setOpen(true);
      console.error(err);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const signUserOut = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;
        const userData = userDoc.data();

        const linkId = userData.linkId;

        if (linkId) {
          const chatDocRef = doc(db, "chats", linkId);

          const messagesCollectionRef = collection(chatDocRef, "messages");
          const messagesSnapshot = await getDocs(messagesCollectionRef);

          const deletePromises = messagesSnapshot.docs.map((doc) =>
            deleteDoc(doc.ref)
          );
          await Promise.all(deletePromises);

          await deleteDoc(chatDocRef);

          await updateDoc(userDocRef, {
            linkId: "",
          });
        }
      }

      await signOut(auth);
      cookies.remove("auth-token");
      dispatch(setAuth(false));
      dispatch(setLinkId(null));
      toast.success("Sign Out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error during sign out, Please try again");
      console.error("Error during sign out: ", error);
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

  return (
    <nav>
      <Box
        sx={{
          flexGrow: 1,
          position: "fixed",
          zIndex: 99,
        }}
      >
        <AppBar>
          <Toolbar>
            <Link to="/" style={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1, fontWeight: "bold" }}
              >
                Chat App
              </Typography>
            </Link>
            {isAuth ? (
              <Button
                onClick={() => signUserOut(emailId)}
                color="inherit"
                variant="outlined"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={signInWithGoogle}
                className="flex gap-2"
              >
                <GoogleIcon />
                Sign in with Google
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Failed to Sign In, Please try again
        </Alert>
      </Snackbar>
    </nav>
  );
};

export default Navbar;
