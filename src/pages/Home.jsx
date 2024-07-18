import React, { useEffect, useState } from "react";
import { Auth } from "../components/Auth";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
  return (
    <div>
      <Auth />
    </div>
  );
};

export default Home;
