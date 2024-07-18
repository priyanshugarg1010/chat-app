import React from "react";
import Slider from "react-slick";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import calender from "../assets/calender.svg";
import link from "../assets/link.svg";
import security from "../assets/security.svg";

const messages = [
  {
    text: "Your chats are encrypted and safe.",
    image: security,
  },
  {
    text: "Join meetings with a simple link.",
    image: link,
  },
  {
    text: "Chat with anyone, anywhere",
    image: calender,
  },
];

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Box
      sx={{
        width: 400,
        height: 300,
        padding: 2,
      }}
    >
      <div className="slider-container">
        <Slider {...settings}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 300,
                height: 300,
              }}
            >
              <img
                src={message.image}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%" }}
              />
              <Typography variant="h6" marginTop="1em">
                {message.text}
              </Typography>
            </Box>
          ))}
        </Slider>
      </div>
    </Box>
  );
}

export default Carousel;
