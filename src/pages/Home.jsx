import React, { useState } from "react";
import { Auth } from "../components/Auth";
import { setAuth } from "../slice/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Home = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();

  if (!isAuth) {
    return <Auth setIsAuth={(value) => dispatch(setAuth(value))} />;
  }

  return <div>chat</div>;
};

export default Home;
