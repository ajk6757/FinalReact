import React, { useState, useEffect } from "react";
import FollowModalSearchbar from "./FollowModalSearchbar";
import { useAuth } from "../LoginContext.js";
import { useNavigate } from "react-router-dom";

function FollowListModal({
  followedMembers,
  onUnfollow,
  isUnfollowConfirmation,
  setIsUnfollowConfirmation,
  isVisitor,
  propsMyItems,
  onClose,
}) {
  const { user } = useAuth();
  const [searchedFollows, setSearchedFollows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const { profileImgList, userIdList } = propsMyItems;
  const imageUrl = "http://localhost:3000/Muzip/resources/image/";
  const navigate = useNavigate();

  useEffect(() => {
    setSearchedFollows(followedMembers);
    setLoading(false);
  }, [followedMembers]);

  const handleSearch = () => {
    const filteredFollows = followedMembers.filter((follow) =>
      follow.memberId.includes(searchText)
    );
    setSearchedFollows(filteredFollows);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchedFollows(followedMembers);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const isFollowed = (follow) => {
    return followedMembers.some(
      (member) => member.memberId === follow.memberId
    );
  };

  const handleUnfollowClick = (follow) => {
    updateFollowStatus(follow.memberId, { isUnfollowPending: true });
    setIsUnfollowConfirmation(true);
  };

  const handleFollow = (follow) => {
    const isFollowing = isFollowed(follow);

    if (isFollowing && isUnfollowConfirmation) {
      onUnfollow(follow.memberId);
      setSearchedFollows((prevFollows) =>
        prevFollows.filter((f) => f.memberId !== follow.memberId)
      );
      setIsUnfollowConfirmation(false);
    } else if (isFollowing) {
      handleUnfollowClick(follow);
    }
  };

  const updateFollowStatus = (memberId, status) => {
    setSearchedFollows((prevFollows) =>
      prevFollows.map((f) =>
        f.memberId === memberId ? { ...f, ...status } : f
      )
    );
  };

  const updateFollowButton = (follow) => {
    const isFollowing = isFollowed(follow);

    if (isFollowing) {
      if (follow.isUnfollowPending) {
        return "취소 확인";
      } else {
        return "팔로우 취소";
      }
    } else {
      return "팔로우";
    }
  };
  const updateFollowButtonClass = (follow) => {
    const isFollowing = isFollowed(follow);

    if (isFollowing) {
      if (follow.isUnfollowPending) {
        return "followModal-confirm-unfollow-btn";
      } else {
        return "followModal-unfollow-btn";
      }
    } else {
      return "followModal-follow-btn";
    }
  };

  //마이페이지 이동
  const handleNavigate = (memberNo) => {
    navigate(`/user/${memberNo}`);
    onClose();
  };
  return (
    <div className="myinfo-follow-modal-body">
      <FollowModalSearchbar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onSearch={handleSearch}
        onResetSearch={handleResetSearch}
      />

      <div className="myinfo-follow-list">
        {loading ? (
          <div className="myinfo-follow-list-no-results">Loading...</div>
        ) : searchedFollows.length === 0 ? (
          <div className="myinfo-follow-list-no-results">
            {followedMembers.length === 0
              ? "팔로우가 없습니다."
              : "검색 결과가 없습니다."}
          </div>
        ) : (
          searchedFollows.map((follow) => (
            <div key={follow.memberId} className="myinfo-follow-list-content">
              <div className="myinfo-follow-list-img-area">
                <img
                  className="myinfo-follow-list-img"
                  src={imageUrl + profileImgList[follow.memberNo]}
                  alt=""
                  onClick={() => handleNavigate(follow.memberNo)}
                />
              </div>
              <div
                className="myinfo-follow-list-id"
                onClick={() => handleNavigate(follow.memberNo)}
              >
                <span>{follow.memberId}</span>
              </div>
              {!isVisitor && ( // 방문자가 아닐 때만 버튼을 렌더링
                <div className="myinfo-follow-list-btn">
                  <button
                    onClick={() => handleFollow(follow)}
                    className={updateFollowButtonClass(follow)}
                  >
                    {updateFollowButton(follow)}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FollowListModal;
