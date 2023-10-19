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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { changeMyPageBgm, changeYourMusicList } from "../redux/musicListSlice";

function MypageBody(props) {
  //밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();
  const { isPageOwner, propsMyItems } = props;
  const { pageUserNo } = useParams();
  const [pageUserData, setPageUserData] = useState(user);
  // 로그인 사용자와 방문자를 구분
  const {getUserProfileImgList} = propsMyItems;
  const isVisitor = !isPageOwner;
  const playlists = useSelector((state) => state.musicList.yourMusicList);
  //=================== 마이페이지 리스트 셋팅 ==================

  const dispatch = useDispatch();
  const yourListSetting = () => {
    axios
      .get("http://localhost:3000/Muzip/myPlaylist", {
        params: {
          userNo: pageUserNo,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        let tempArr = [];
        if (response.data === null || response.data.length === 0) {
          dispatch(
            changeYourMusicList({
              yourMusicList: [...tempArr],
            })
          );
        } else {
          for (let i = 0; i < response.data.length; i++) {
            tempArr[i] = {
              listName: response.data[i].playlistName,
              playlistNo: response.data[i].playlistNo,
              songList: response.data[i].playlistSongs,
            };
          }
          dispatch(
            changeYourMusicList({
              yourMusicList: [...tempArr],
            })
          );
        }
      })
      .catch(console.log);
  };
  useEffect(() => {
    yourListSetting();
  }, [pageUserNo]);

  /////////////////////////////////////////////////////////////////////////////////

  //===============마이페이지 유저의 정보가져오기=================================

  const fetchUserData = () => {
    axios
      .get(`http://localhost:3000/Muzip/getUserData/${pageUserNo}`)
      .then((response) => {
        setPageUserData(response.data);
        setParentIntroText(response.data.userInfo);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [pageUserNo]); // pageUserNo가 변경될 때마다 사용자 정보를 다시 불러옵니다.

  useEffect(() => {
    //console.log(pageUserData); // pageUserData가 변경될 때마다 로그에 출력
  }, [pageUserData]);

  //=======================================프로필 데이터 변경=====================
  // 기본 배경 이미지 및 프로필 이미지 상태 설정
  // 서버 URL을 기본 변수로 설정
  const baseServerUrl = "http://localhost:8082/Muzip";
  const defaultBackgroundImage = `${baseServerUrl}/resources/image/basicBackImg.jpg`;
  const defaultprofileImage = `${baseServerUrl}/resources/image/noPorofile.jpg`;

  // 사용자 정보에 해당하는 상태 설정
  const [parentIntroText, setParentIntroText] = useState();
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
    formData.append("userNo", pageUserNo);

    const selectedProfileImage = document.querySelector("#profileImg").files[0];
    const selectedBackgroundImage = document.querySelector("#backImg").files[0];

    // 프로필 이미지에 변경이 있는지 확인 및 FormData에 추가
    if (selectedProfileImage || profileImage !== defaultprofileImage) {
      if (
        selectedProfileImage &&
        selectedProfileImage.type.startsWith("image/")
      ) {
        formData.append("profileImage", selectedProfileImage);
        // console.log(
        //   "프로필이미지 업데이트: ",
        //   selectedProfileImage.name,
        //   selectedProfileImage.type
        // );
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
        //console.log("배경이미지 업데이트: ", selectedBackgroundImage.name);
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
        getUserProfileImgList();
        //console.log("이게 응답받은 프로필 url: ", profileImage);
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
      userNo: pageUserNo,
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
    const defaultBackgroundImage = `${baseServerUrl}/resources/image/basicBackImg.jpg`;
    const defaultprofileImage = `${baseServerUrl}/resources/image/noPorofile.jpg`;
    try {
      const response = await axios.get(
        `http://localhost:3000/Muzip/getUserProfile/${pageUserNo}`
      );

      // 받아온 사용자 프로필 정보를 상태로 설정
      const { profileImageURL, backgroundImageURL, userInfo, backMuNo } =
        response.data;

      // 만약 profileImageURL이 존재하면 사용, 아니면 기본 이미지 사용
      setProfileImage(
        profileImageURL
          ? `${baseServerUrl}${profileImageURL}`
          : defaultprofileImage
      );

      // 만약 backgroundImageURL이 존재하면 사용, 아니면 기본 이미지 사용
      setBackgroundImage(
        backgroundImageURL
          ? `${baseServerUrl}${backgroundImageURL}`
          : defaultBackgroundImage
      );

      setParentIntroText(userInfo);
      setBackMusicNo(backMuNo);
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
    }
  };

  // 예를 들면, 컴포넌트가 마운트될 때 프로필 정보를 가져오고 싶다면:
  useEffect(() => {
    fetchUserProfile();
  }, [pageUserNo]);

  //====================프로필 데이터 변경 끝=============================================
  // ===================== 프로필 데이터 변경 후 BGM 재생 ============================
  //=================== 마이페이지 BGM 셋팅 =====================
  const CurrentBgm = useSelector((state) => state.musicList.myPageBgm);

  const bgmSetting = () => {
    let musicNo = "";
    musicNo += backMusicNo;
    axios
      .get("http://localhost:3000/Muzip/selectOneMusic", {
        params: {
          musicNo: musicNo,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        let tempArr = [];
        if (response.data === null || response.data === undefined) {
          dispatch(
            changeMyPageBgm({
              myPageBgm: [...tempArr],
            })
          );
        } else {
          tempArr[0] = {
            listName: "BGM",
            songList: [response.data],
          };
          dispatch(
            changeMyPageBgm({
              myPageBgm: [...tempArr],
            })
          );
        }
      })
      .catch(console.log);
  };
  useEffect(() => {
    if (backMusicNo != null) {
      bgmSetting();
    }
  }, [backMusicNo]);

  // ==================== BGM 재생 끝 ====================================
  const [showMyinfoSetting, setShowMyinfoSetting] = useState(false);
  const [showMyprofileImg, setShowMyprofileImg] = useState(true);

  const [activeComponent, setActiveComponent] = useState(
    <Myfeed propsMyItems={propsMyItems} pageUserNo={pageUserNo} />
  );

  const moveToTop = () => {
    document
      .getElementById("main-content")
      .scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuItemClick = (menu) => {
    if (menu === "feed") {
      setActiveComponent(
        <Myfeed propsMyItems={propsMyItems} pageUserNo={pageUserNo} />
      );
    } else if (menu === "myplaylist") {
      setActiveComponent(
        <MypageMyPlaylist
          playlists={playlists}
          onPlaylistBoxClick={handlePlaylistBoxClick}
          propsMyItems={propsMyItems}
          pageUserData={pageUserData}
        />
      );
    } else if (menu === "myfav") {
      setActiveComponent(
        <MypageMyfav propsMyItems={propsMyItems} pageUserNo={pageUserNo} />
      );
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
        pageUserData={pageUserData}
        propsMyItems={propsMyItems}
      />
    );
  };

  const handleBackToMyPagePlayList = () => {
    setActiveComponent(
      <MypageMyPlaylist
        playlists={playlists}
        onPlaylistBoxClick={handlePlaylistBoxClick}
        pageUserData={pageUserData}
        propsMyItems={propsMyItems}
      />
    );
  };

  const renderContent = () => {
    if (!isVisitor && showMyinfoSetting) {
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
          propsMyItems={propsMyItems}
        />
      );
    } else {
      return (
        <>
          <MypageMyinfo
            onMyinfoSettingLinkClick={
              isVisitor ? null : handleMyinfoSettingLinkClick
            }
            profileImage={profileImage}
            backgroundImage={backgroundImage}
            setProfileImage={setProfileImage}
            setBackgroundImage={setBackgroundImage}
            userInfo={parentIntroText}
            pageUserData={pageUserData}
            isVisitor={!isPageOwner}
            propsMyItems={propsMyItems}
          />
          <MypageMenubar
            onMenuClick={handleMenuItemClick}
            pageUserNo={pageUserNo}
          />{" "}
          {activeComponent}
        </>
      );
    }
  };

  useEffect(() =>{
    handleMenuItemClick();
  })


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
