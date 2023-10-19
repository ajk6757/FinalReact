import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { CiSettings } from "react-icons/ci";
import MyinfofollowModal from "./myinfoFollowModal";
import MyinfofollowerModal from "./myinfoFollowerModal";
import { useAuth } from "../LoginContext.js";
import axios from "axios";
import { useSelector } from "react-redux";
const API_BASE_URL = "http://localhost:3000/Muzip";
const MODAL_STYLE = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    position: "absolute",
    top: "22%",
    left: "40%",
    right: "41%",
    bottom: "auto",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "1.5%",
    outline: "none",
    padding: 0,
    minWidth: "300px", // 원하는 최소 너비를 지정합니다.
    minHeight: "200px", // 원하는 최소 높이를 지정합니다.
  },
};

Modal.setAppElement("#root");

function MypageMyinfo({
  onMyinfoSettingLinkClick,
  userInfo,
  pageUserData,
  isVisitor,
  propsMyItems,
}) {
  const { user } = useAuth();
  const [followModalIsOpen, setfollowModalIsOpen] = useState(false);
  const [followerModalIsOpen, setfollowerModalIsOpen] = useState(false);
  const [followListCount, setFollowListCount] = useState(0);
  const [followedMembers, setFollowedMembers] = useState([]); // 내가 팔로우하는 사람들
  const [followersData, setFollowersData] = useState([]); //나를 팔로우하는 팔로워들
  const [followerListCount, setFollowerListCount] = useState(0);
  const [isUnfollowConfirmation, setIsUnfollowConfirmation] = useState(false);
  const alarmStompClient = useSelector(
    (state) => state.alarmState.alarmStompClient
  );

  //페이지 유저넘버바뀌면 바로 페이지유저랑, 로그인 유저의 팔로우 관계체크

  useEffect(() => {
    if (isVisitor) {
      axios
        .get(
          `http://localhost:3000/Muzip/checkFollow?userId=${user.userId}&memberId=${pageUserData.userId}`
        )
        .then((response) => {
          setIsFollowingPageOwner(response.data.isFriend);
        })
        .catch(console.error);
    }
    fetchDataAndCheckFollow();
  }, [pageUserData]);
  const [isFollowingPageOwner, setIsFollowingPageOwner] = useState(false); //이건 페이지유저랑 로그인 유저랑 팔로우관계버튼에 필요

  // 팔로워와 팔로잉 데이터 가져오기
  const fetchDataAndCheckFollow = async () => {
    try {
      const [followListResponse, followerListResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/followlist?userId=${pageUserData.userId}`),
        axios.get(`${API_BASE_URL}/followerlist?userId=${pageUserData.userId}`),
      ]);
      setFollowedMembers(followListResponse.data);

      const followerIds = followerListResponse.data.map(
        (follower) => follower.userId
      );
      const checkFollowResponse = await axios.post(
        `${API_BASE_URL}/checkMultipleFollow`,
        {
          userId: pageUserData.userId,
          followerIds: followerIds,
        }
      );

      const updatedFollowersData = followerListResponse.data.map(
        (follower) => ({
          ...follower,
          isFriend: checkFollowResponse.data[follower.userId] || false,
          isUnfollowPending: false,
          userNo: follower.userNo,
          memberNo: follower.memberNo,
        })
      );

      setFollowersData(updatedFollowersData);
    } catch (error) {
      console.error("데이터를 가져오는 도중 오류 발생:", error);
    }
  };

  const handleFollow = async (follower) => {
    try {
      const isFollowing = followedMembers.some(
        (followed) => followed.memberId === follower.userId
      );

      const apiUrl = isFollowing
        ? `/unFollow?userId=${pageUserData.userId}&memberId=${follower.userId}`
        : `/Follow?userId=${pageUserData.userId}&memberId=${follower.userId}`;

      await axios.post(`${API_BASE_URL}${apiUrl}`).then(() => {
        const followAlarm = sessionStorage.getItem("followAlarm");
        if (
          followAlarm == "Y" &&
          apiUrl ==
            `http://localhost:3000/Muzip/Follow?userId=${pageUserData.userId}&memberId=${follower.userId}`
        ) {
          const newAlarm = {
            alarmNo: "",
            alarmMessage: "",
            receiverNo: follower.userId,
            senderNo: pageUserData.userId,
            alarmKind: "follow",
            alarmPath: "",
            createDate: new Date().toISOString(),
            checkStatus: "N",
            status: "Y",
          };
          alarmStompClient.send("/alarm/alarm", {}, JSON.stringify(newAlarm));
        }
      });

      const updatedFollowedMembers = isFollowing
        ? followedMembers.filter(
            (followed) => followed.memberId !== follower.userId
          )
        : [...followedMembers, { ...follower, userId: follower.memberId }];

      setFollowedMembers(updatedFollowedMembers);
      fetchDataAndCheckFollow();
    } catch (error) {
      console.error("팔로우 또는 언팔로우 요청 실패:", error);
    }
  };

  const updateFollowButton = (follower) => {
    const isFollowing = followedMembers.some(
      (followed) => followed.memberId === follower.userId
    );

    if (isFollowing) {
      if (follower.isUnfollowPending) {
        return "취소 확인";
      } else {
        return "팔로우 취소";
      }
    } else {
      return "팔로우";
    }
  };
  const updateFollowButtonClass = (follower) => {
    const isFollowing = followedMembers.some(
      (followed) => followed.memberId === follower.userId
    );

    if (isFollowing) {
      if (follower.isUnfollowPending) {
        return "followModal-confirm-unfollow-btn";
      } else {
        return "followModal-unfollow-btn";
      }
    } else {
      return "followModal-follow-btn";
    }
  };
  const unfollowMember = async (memberId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/unFollow?userId=${pageUserData.userId}&memberId=${memberId}`
      );

      // 팔로우 리스트 업데이트 로직
      setFollowedMembers((prev) =>
        prev.filter((member) => member.memberId !== memberId)
      );
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  };
  useEffect(() => {
    setFollowListCount(followedMembers.length);
  }, [followedMembers]);

  useEffect(() => {
    setFollowerListCount(followersData.length);
  }, [followersData]);

  // 언팔 확인버튼때문에 추가
  const [confirmUnfollow, setConfirmUnfollow] = useState(false);

  const handleFollowToggle = async () => {
    if (isFollowingPageOwner) {
      if (confirmUnfollow) {
        // "언팔로우 확인" 버튼을 눌렀을 때 언팔로우 실행
        try {
          await axios.post(
            `${API_BASE_URL}/unFollow?userId=${user.userId}&memberId=${pageUserData.userId}`
          );
          setIsFollowingPageOwner(false);
          setConfirmUnfollow(false); // 상태 리셋
          fetchDataAndCheckFollow();
        } catch (error) {
          console.error("언팔로우 실패:", error);
        }
      } else {
        // 첫번째 "언팔로우" 버튼을 눌렀을 때 "언팔로우 확인" 모드로 전환
        setConfirmUnfollow(true);
      }
    } else {
      // 팔로우 실행 로직
      try {
        await axios
          .post(
            `${API_BASE_URL}/Follow?userId=${user.userId}&memberId=${pageUserData.userId}`
          )
          .then(() => {
            const followAlarm = sessionStorage.getItem("followAlarm");
            if (followAlarm == "Y") {
              const newAlarm = {
                alarmNo: "",
                alarmMessage: "",
                receiverNo: pageUserData.userId,
                senderNo: user.userId,
                alarmKind: "follow",
                alarmPath: "",
                createDate: new Date().toISOString(),
                checkStatus: "N",
                status: "Y",
              };
              alarmStompClient.send(
                "/alarm/alarm",
                {},
                JSON.stringify(newAlarm)
              );
            }
          });
        setIsFollowingPageOwner(true);
        fetchDataAndCheckFollow();
      } catch (error) {
        console.error("팔로우 실패:", error);
      }
    }
  };

  const myPageFollowButton = () => {
    if (confirmUnfollow) {
      return "취소 확인";
    }
    return isFollowingPageOwner ? "팔로우 취소" : "팔로우";
  };

  const myPageFollowButtonClass = () => {
    if (confirmUnfollow) {
      return "myinfo-confirm-unfollow-btn";
    }
    return isFollowingPageOwner ? "myinfo-unfollow-btn" : "myinfo-upfollow-btn";
  };

  return (
    <div id="myinfo">
      <div id="myinfo-text">
        <div className="myinfo-idzone">
          <span className="myinfo-nick">{pageUserData.userName}</span>
          <p className="myinfo-id">@{pageUserData.userId}</p>
          {pageUserData.membershipNo === 3 && (
            <img
              className="myinfo-mark"
              src="http://localhost:8082/Muzip/resources/image/music_mark.png"
              alt="뮤집마크"
            />
          )}
        </div>
        <ul className="myinfo-followzone">
          <li
            className="myinfo-follow-btn"
            onClick={() => setfollowModalIsOpen(true)}
          >
            팔로우
            <span className="myinfo-follow">{followListCount}</span>
          </li>
          <Modal
            isOpen={followModalIsOpen}
            onRequestClose={() => setfollowModalIsOpen(false)}
            style={MODAL_STYLE}
          >
            <MyinfofollowModal
              onClose={() => setfollowModalIsOpen(false)}
              followedMembers={followedMembers}
              onUnfollow={unfollowMember}
              isUnfollowConfirmation={isUnfollowConfirmation}
              setIsUnfollowConfirmation={setIsUnfollowConfirmation}
              isVisitor={isVisitor}
              propsMyItems={propsMyItems}
            />
          </Modal>
          <li
            className="myinfo-follower-btn"
            onClick={() => setfollowerModalIsOpen(true)}
          >
            팔로워
            <span className="myinfo-follower">{followerListCount}</span>
          </li>
          <Modal
            isOpen={followerModalIsOpen}
            onRequestClose={() => setfollowerModalIsOpen(false)}
            style={MODAL_STYLE}
          >
            <MyinfofollowerModal
              onClose={() => setfollowerModalIsOpen(false)}
              onFollow={handleFollow}
              updateFollowButton={updateFollowButton}
              followersData={followersData}
              followedMembers={followedMembers}
              setFollowedMembers={setFollowedMembers}
              isVisitor={isVisitor}
              propsMyItems={propsMyItems}
              updateFollowButtonClass={updateFollowButtonClass}
            />
          </Modal>
        </ul>
        <p className="myinfo-introduce">{userInfo}</p>
      </div>
      <div id="myinfo-setting">
        {isVisitor ? (
          <>
            <button
              className={myPageFollowButtonClass()}
              onClick={handleFollowToggle}
            >
              {myPageFollowButton()}
            </button>
          </>
        ) : (
          // 방문자가 아닐 때의 렌더링
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={onMyinfoSettingLinkClick}
          >
            <CiSettings size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default MypageMyinfo;
