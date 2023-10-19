import React from "react";
import "../main.css";
import { useAuth } from "../LoginContext.js";

function MyprofileBackImg({ backImg }) {
  // 밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();

  //console.log("배경이미지 URL:", backImg); // URL 확인

  return (
    <div id="profile-back-img">
      <img src={backImg} alt="Background" />
    </div>
  );
}

export default MyprofileBackImg;
