import "../main.css";
import React from "react";
import { useAuth } from "../LoginContext.js";

function MyprofileImg({ profileImage }) {
  //밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();
  return (
    <div className="myprofile-img">
      <img id="myprofile-img" src={profileImage} alt="Profile" />
    </div>
  );
}

export default MyprofileImg;
