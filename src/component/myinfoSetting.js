import "../myprofileSetting.css";
import TextArea from "./textarea";
import React, { useState } from "react";
import { useAuth } from "../LoginContext.js";
import bootstrap from "bootstrap";
import { Button } from "react-bootstrap";
import Modal from "bootstrap";
import $ from "jquery";
import { changeSearchMusicList } from "../redux/musicListSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function MyinfoSetting({
  onIntroTextChange,
  profileImage,
  backgroundImage,
  setProfileImage,
  setBackgroundImage,
  onUpdateProfile,
  userInfo,
  onMyinfoSettingLinkBack,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchMusicList = useSelector(
    (state) => state.musicList.searchMusicList
  );
  const [mNo, setmNo] = useState();
  const { user } = useAuth();
  const [introText, setIntroText] = useState(
    userInfo && userInfo !== "0" ? userInfo : ""
  );
  const [prevProfileImage, setPrevProfileImage] = useState(profileImage);
  const [prevBackgroundImage, setPrevBackgroundImage] =
    useState(backgroundImage);
  const [prevIntroText, setPrevIntroText] = useState(introText);

  const handleIntroTextChange = (newText) => {
    setPrevIntroText((prev) => (prev ? prev : introText));
    setIntroText(newText);
    onIntroTextChange(newText);
  };

  const handleProfileImageChange = (event) => {
    setPrevProfileImage(profileImage);
    const newProfileImage = URL.createObjectURL(event.target.files[0]);
    setProfileImage(newProfileImage);
  };

  const handleBackgroundImageChange = (event) => {
    setPrevBackgroundImage(backgroundImage);
    const newBackgroundImage = URL.createObjectURL(event.target.files[0]);
    setBackgroundImage(newBackgroundImage);
  };

  const resetForm = () => {
    setProfileImage(prevProfileImage);
    setBackgroundImage(prevBackgroundImage);
    setIntroText(prevIntroText);
  };

  const handleBackClick = () => {
    onIntroTextChange(prevIntroText);
    resetForm(); // form을 리셋
    onMyinfoSettingLinkBack(); // 뒤로 이동
  };

  //====================================뮤직 첨부 함수=====내가 수정할거 없음=============================================================
  function searchMusic() {
    const keyword = $("#searchKeyword");
    if (
      keyword.val() !== null &&
      keyword.val() !== "" &&
      keyword.val() !== undefined
    ) {
      axios
        .get("http://localhost:3000/Muzip/searchMusic", {
          params: {
            keyword: keyword.val(),
          },
          headers: {
            "Content-Type": "application/json",
          },
        }) // 주소 얻고
        .then((response) => {
          // 응답성공하면 데이터 세팅
          let tempArr = [];
          tempArr[0] = {
            listName: "검색",
            songList: response.data,
          };
          dispatch(
            changeSearchMusicList({
              searchMusicList: [...tempArr],
            })
          );
        })
        .catch(console.log); // 아니면 오류 로그찍기
    }
    keyword.val("");
  }
  function pressEnter(e) {
    if (e.key == "Enter" || e.keyCode == "13") {
      searchMusic();
    }
  }
  function namingRule(name) {
    let character;
    let charBytes = 0;
    let tempName = "";
    if (name !== null && name !== "" && name !== undefined) {
      for (let i = 0; i < name.length; i++) {
        character = name.charAt(i);
        if (escape(character).length > 4) charBytes += 2;
        else charBytes += 1.4;
        if (charBytes >= 50) break;
        else tempName += character;
      }

      if (charBytes >= 50) {
        return tempName + "...";
      } else {
        return tempName;
      }
    } else {
      return "";
    }
  }

  function setMusicNo(musicNo) {
    setmNo(musicNo);
    $("#write-music-close-btn").click();
  }
  //====================================================여기까지 음악첨부 내가 수정할거 없음========================================
  return (
    <div className="myinfo-setting-form-area">
      <form
        className="myinfo-setting-form"
        onSubmit={(e) => {
          e.preventDefault();
          onUpdateProfile(e);
          onMyinfoSettingLinkBack();
        }}
      >
        <div className="myinfo-setting-form-title">
          <h3>프로필 변경</h3>
        </div>
        <div className="myprofile-setting-img-area">
          <img id="myprofile-setting-img" src={profileImage} alt="Profile" />
        </div>
        <div className="myprofile-setting-info">
          <span className="myprofile-setting-id">{user.userId}</span>
        </div>
        <div className="myinfo-setting-btns">
          <label htmlFor="profileImg" className="myinfo-setting-profile-img">
            프로필 사진 변경하기
          </label>
          <input
            name="profileImg"
            type="file"
            accept="image/*"
            id="profileImg"
            onChange={handleProfileImageChange}
          />

          <label htmlFor="backImg" className="myinfo-setting-back-img">
            배경 사진 변경하기
          </label>
          <input
            name="backImg"
            type="file"
            accept="image/*"
            id="backImg"
            onChange={handleBackgroundImageChange}
          />

          <label
            htmlFor="backMusic"
            className="myinfo-setting-back-music"
            onClick={() => $(".modal-backdrop").remove()}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            배경 음악 변경하기
          </label>
          <input name="backMusic" type="hidden" id="backMusic" value={mNo} />
        </div>
        <TextArea
          initialText={introText}
          onTextChange={handleIntroTextChange}
        />
        <div className="myprofile-setting-btn-area">
          <button type="submit" className="myprofile-setting-submit-btn">
            변경
          </button>
          <button
            className="myprofile-setting-back-btn"
            onClick={handleBackClick}
          >
            뒤로가기
          </button>
        </div>
      </form>

      {/*====================뮤직첨부 모달 ================ */}
      <div
        className="modal writeModalWrap"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog writeModalWrap2 modal-dialog-centered">
          <div className="modal-content writeModal ">
            <div className="modal-body">
              <div id="write-music-search-header">
                <h4>음악 검색</h4>
              </div>

              <div id="write-music-searchbar">
                <input id="searchKeyword" type="search" onKeyUp={pressEnter} />
                <span>
                  <svg
                    onClick={searchMusic}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </span>
              </div>

              <div id="write-music-search-body">
                {
                  /* =================== 검색결과 들어갈 영역 ===================== */
                  searchMusicList.map((item, index) => (
                    <div
                      id={"searchBoardMusic" + index}
                      key={"searchBoardMusic" + item.listName}
                    >
                      {item.songList.map((item2, index2) => (
                        <div
                          className="searchBoardMusicOne"
                          key={
                            "searchBoardMusic" + item.listName + "_" + index2
                          }
                          onClick={() => setMusicNo(item2.musicNo)}
                        >
                          <div className="searchBoardMusicInfo">
                            <img
                              src={
                                "http://localhost:8082/Muzip" + item2.coverPath
                              }
                            />
                            <p>
                              {namingRule(item2.musicTitle)}
                              <br />
                              {namingRule(item2.musicArtist)}
                            </p>
                          </div>
                          <AiOutlinePlus
                            className="searchBoardMusicOneIcon"
                            size="2vw"
                          />
                        </div>
                      ))}
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="modal-footer write-Modal-footer">
              <button type="button" id="write-music-upload-btn">
                첨부
              </button>
              <button
                type="button"
                id="write-music-close-btn"
                data-bs-dismiss="modal"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*====================뮤직 모달 끝================ */}
    </div>
  );
}

export default MyinfoSetting;
