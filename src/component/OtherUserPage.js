import "../main.css";
import MypageMyinfo from "./mypageMyinfo";
import MyinfoSetting from "./myinfoSetting";
import MypageMenubar from "./mypageMenubar";
import MypageMyPlaylist from "./mypageMyPlaylist";
import Myfeed from "./myfeed";
import MyprofileBackImg from "./myprofileBackImg";
import MyprofileImg from "./myprofileImg";
import React, { useState, useEffect } from "react";
import MypageMyfav from "./mypageMyfav";
import MyPlayList from "./MyPlayList";
import { useAuth } from "../LoginContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MypageBody(props) {
  //밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();
  const { propsMyItems } = props;
  const navigate = useNavigate();

  const playlists = useSelector((state) => state.musicList.myMusicList);
  //=======================================프로필 데이터 변경=====================
  // 기본 배경 이미지 및 프로필 이미지 상태 설정
  // 서버 URL을 기본 변수로 설정
  const baseServerUrl = "http://localhost:8082/Muzip";
  const defaultBackgroundImage = `${baseServerUrl}/resources/image/basicBackImg.jpg`;
  const defaultprofileImage = `${baseServerUrl}/resources/image/noPorofile.jpg`;

  // 사용자 정보에 해당하는 상태 설정
  const [parentIntroText, setParentIntroText] = useState(user.userInfo);
  const [backMusicNo, setBackMusicNo] = useState(null);
  const [profileImage, setProfileImage] = useState(defaultprofileImage);
  const [backgroundImage, setBackgroundImage] = useState(
    defaultBackgroundImage
  );

  // 소개 텍스트 변경 핸들러
  const handleIntroTextChange = (text) => {
    setParentIntroText(text);
  };

  // 프로필 및 배경 이미지 업데이트 함수
  const updateProfileImg = async () => {
    const formData = new FormData();

    // 사용자 번호 추가
    formData.append("userNo", user.userNo);

    const selectedProfileImage = document.querySelector("#profileImg").files[0];
    const selectedBackgroundImage = document.querySelector("#backImg").files[0];

    // 프로필 이미지에 변경이 있는지 확인 및 FormData에 추가
    if (selectedProfileImage || profileImage !== defaultprofileImage) {
      if (
        selectedProfileImage &&
        selectedProfileImage.type.startsWith("image/")
      ) {
        formData.append("profileImage", selectedProfileImage);
        console.log(
          "프로필이미지 업데이트: ",
          selectedProfileImage.name,
          selectedProfileImage.type
        );
      } else {
        formData.append("profileImage", profileImage);
      }
    }

    // 배경 이미지에 변경이 있는지 확인 및 FormData에 추가
    if (selectedBackgroundImage || backgroundImage !== defaultBackgroundImage) {
      if (
        selectedBackgroundImage &&
        selectedBackgroundImage.type.startsWith("image/")
      ) {
        formData.append("backgroundImage", selectedBackgroundImage);
        console.log("배경이미지 업데이트: ", selectedBackgroundImage.name);
      } else {
        formData.append("backgroundImage", backgroundImage);
      }
    }

    // API 호출하여 프로필과 배경 이미지 업데이트
    try {
      const response = await axios.post(
        "http://localhost:3000/Muzip/uploadMyProfileImg",
        formData
      );

      // 백엔드 응답으로 새로운 URL 업데이트
      if (response.data.profileImageURL) {
        setProfileImage(`${baseServerUrl}${response.data.profileImageURL}`);
        console.log("이게 응답받은 프로필 url: ", profileImage);
      }
      if (response.data.backgroundImageURL) {
        setBackgroundImage(
          `${baseServerUrl}${response.data.backgroundImageURL}`
        );
      }
    } catch (error) {
      console.error("프로필 업로드 실패:", error);
    }
  };

  const updateProfileOther = async (e) => {
    const backMuNo = e.target.backMusic.value; //이건 user.backMuNo에 넣어줄 부분
    const data = {
      userNo: user.userNo,
      userInfo: parentIntroText,
      backMuNo: backMuNo,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/Muzip/uploadMyProfileOther",
        data
      );
      setParentIntroText(parentIntroText);
      setBackMusicNo(backMuNo);
      return response.data;
    } catch (error) {
      console.error("Error uploading other info:", error);
    }
  };
  //셋팅에서 변경 버튼누르면 두개 함수 실행되도록 함
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfileImg(e);
    await updateProfileOther(e);
  };
  //====================프로필 데이터를 가져오자===========================================
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/Muzip/getUserProfile/${user.userNo}`
      );

      // 받아온 사용자 프로필 정보를 상태로 설정
      const { profileImageURL, backgroundImageURL, userInfo, backMuNo } =
        response.data;

      if (profileImageURL) {
        setProfileImage(`${baseServerUrl}${profileImageURL}`);
      }
      if (backgroundImageURL) {
        setBackgroundImage(`${baseServerUrl}${backgroundImageURL}`);
      }
      setParentIntroText(userInfo);
      setBackMusicNo(backMuNo);
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
    }
  };

  // 예를 들면, 컴포넌트가 마운트될 때 프로필 정보를 가져오고 싶다면:
  useEffect(() => {
    fetchUserProfile();
  }, []);

  //====================프로필 데이터 변경 끝=============================================
  const [showMyinfoSetting, setShowMyinfoSetting] = useState(false);
  const [showMyprofileImg, setShowMyprofileImg] = useState(true);

  const [activeComponent, setActiveComponent] = useState(
    <Myfeed propsMyItems={propsMyItems} />
  );
  const moveToTop = () => {
    document
      .getElementById("main-content")
      .scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuItemClick = (menu) => {
    if (menu === "feed") {
      setActiveComponent(<Myfeed propsMyItems={propsMyItems} />);
    } else if (menu === "myplaylist") {
      setActiveComponent(
        <MypageMyPlaylist
          playlists={playlists}
          onPlaylistBoxClick={handlePlaylistBoxClick}
        />
      );
    } else if (menu === "myfav") {
      setActiveComponent(<MypageMyfav propsMyItems={propsMyItems} />);
    }
    // 다른 메뉴 추가 가능
  };

  const handleMyinfoSettingLinkClick = () => {
    setShowMyinfoSetting(true);
    setShowMyprofileImg(false);
  };
  const handleMyinfoSettingLinkBack = () => {
    setShowMyinfoSetting(false);
    setShowMyprofileImg(true);
  };

  const handlePlaylistBoxClick = (index) => {
    setActiveComponent(
      <MyPlayList
        playlists={playlists}
        selectedPlaylistIndex={index} // Pass the selected index
        onBackToMyPagePlayList={handleBackToMyPagePlayList}
      />
    );
  };

  const handleBackToMyPagePlayList = () => {
    setActiveComponent(
      <MypageMyPlaylist
        playlists={playlists}
        onPlaylistBoxClick={handlePlaylistBoxClick}
      />
    );
  };

  const renderContent = () => {
    if (showMyinfoSetting) {
      return (
        <MyinfoSetting
          profileImage={profileImage}
          backgroundImage={backgroundImage}
          setProfileImage={setProfileImage}
          setBackgroundImage={setBackgroundImage}
          onUpdateProfile={handleUpdateProfile}
          onIntroTextChange={handleIntroTextChange}
          userInfo={parentIntroText}
          backMusicNo={backMusicNo}
          onMyinfoSettingLinkBack={handleMyinfoSettingLinkBack}
        />
      );
    } else {
      return (
        <>
          <MypageMyinfo
            onMyinfoSettingLinkClick={handleMyinfoSettingLinkClick}
            profileImage={profileImage}
            backgroundImage={backgroundImage}
            setProfileImage={setProfileImage}
            setBackgroundImage={setBackgroundImage}
            userInfo={parentIntroText}
          />
          <MypageMenubar onMenuClick={handleMenuItemClick} /> {activeComponent}
        </>
      );
    }
  };

  return (
    <div className="main_content" id="main-content">
      <MyprofileBackImg backImg={backgroundImage} />
      {showMyprofileImg && <MyprofileImg profileImage={profileImage} />}
      {renderContent()}
      <div onClick={moveToTop} id="moveToTopWrap" className="11">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-up-circle"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
          />
        </svg>
        TOP
      </div>
    </div>
  );
}

export default MypageBody;
