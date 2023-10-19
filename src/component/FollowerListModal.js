import React, { useState, useEffect } from "react";
import FollowerModalSearchbar from "./FollowerModalSearchbar";
import { useNavigate } from "react-router-dom";

function FollowerListModal({
  followersData, // 로그인한 유저를 팔로우하고 있는 유저들의 목록
  followedMembers, // 최상위 컴포넌트에서 전달된 팔로우한 유저 목록
  onFollow, // 팔로우 버튼 클릭 시 호출할 함수
  setFollowedMembers,
  isVisitor,
  propsMyItems,
  updateFollowButton,
  handleMemberClick,
  onClose,
  updateFollowButtonClass,
}) {
  const [searchText, setSearchText] = useState("");
  const [searchedFollowers, setSearchedFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unfollowPendingList, setUnfollowPendingList] = useState([]);
  const { profileImgList, userIdList } = propsMyItems;
  const imageUrl = "http://localhost:3000/Muzip/resources/image/";
  const navigate = useNavigate();

  useEffect(() => {
    setSearchedFollowers(followersData);
    setLoading(false);
  }, [followersData]);

  const handleSearch = () => {
    const filteredFollowers = searchedFollowers.filter((follower) =>
      follower.userId.includes(searchText)
    );
    setSearchedFollowers(filteredFollowers);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchedFollowers(followersData);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleFollow = async (follower) => {
    const isFollowing = followedMembers.some(
      (followed) => followed.memberId === follower.userId
    );

    // 팔로우 취소 상태 확인
    if (isFollowing && follower.isUnfollowPending) {
      onFollow(follower, "unfollow");
      // 여기서 실제로 언팔로우 API를 호출하게 됩니다.
    } else if (isFollowing) {
      // 언팔로우 상태로 설정
      updateFollowerStatus(follower.userId, { isUnfollowPending: true });
      return;
    } else {
      onFollow(follower, "follow");
    }

    // 팔로워 목록 상태 업데이트
    const updatedFollowers = searchedFollowers.map((f) => {
      if (f.userId === follower.userId) {
        return {
          ...f,
          isFriend: !isFollowing, // 팔로우 상태 반전
          isUnfollowPending: false, // 항상 팔로우/언팔로우 후에는 초기화
        };
      }
      return f;
    });
    setSearchedFollowers(updatedFollowers);
  };

  const updateFollowerStatus = (userId, status) => {
    setSearchedFollowers((prevFollowers) =>
      prevFollowers.map((f) => (f.userId === userId ? { ...f, ...status } : f))
    );
  };

  //마이페이지 이동
  const handleNavigate = (userNo) => {
    navigate(`/user/${userNo}`);
    onClose();
  };

  return (
    <div className="myinfo-follower-modal-body">
      <FollowerModalSearchbar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onSearch={handleSearch}
        onResetSearch={handleResetSearch}
      />

      <div className="myinfo-follower-list">
        {loading ? (
          <div className="myinfo-follow-list-no-results">로딩 중...</div>
        ) : searchedFollowers.length === 0 && searchText === "" ? (
          <div className="myinfo-follow-list-no-results">
            팔로워가 없습니다.
          </div>
        ) : searchedFollowers.length === 0 ? (
          <div className="myinfo-follow-list-no-results">
            검색 결과가 없습니다.
          </div>
        ) : (
          searchedFollowers.map((follower) => (
            <div
              key={follower.memberId}
              className="myinfo-follower-list-content"
            >
              <div className="myinfo-follower-list-img-area">
                <img
                  className="myinfo-follower-list-img"
                  src={imageUrl + profileImgList[follower.userNo]}
                  alt=""
                  onClick={() =>
                    handleNavigate(follower.userNo, follower.userId)
                  }
                />
              </div>
              <div
                className="myinfo-follower-list-id"
                onClick={() => handleNavigate(follower.userNo, follower.userId)}
              >
                <span>{follower.userId}</span>
              </div>
              {!isVisitor && ( // 방문자가 아닐 때만 버튼을 렌더링
                <div className="myinfo-follower-list-btn">
                  <button
                    onClick={() => handleFollow(follower)}
                    className={updateFollowButtonClass(follower)}
                  >
                    {updateFollowButton(follower)}
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

export default FollowerListModal;
