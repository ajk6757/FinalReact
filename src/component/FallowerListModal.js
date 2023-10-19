import "../FallowModal.css";
import React, { useState } from "react";
import FallowerModalSearchbar from "./FallowerModalSearchbar";

function FallowerListModal() {
  // 임의의 팔로워 데이터 생성
  const allFollowersData = [
    {
      id: "user1",
      profileImg: "resources/icons/FB_IMG_1516870992875.jpg",
    },
    {
      id: "user2",
      profileImg: "resources/icons/아이유앨범커버1.jpg",
    },
    {
      id: "user3",
      profileImg: "resources/icons/아이유앨범커버2.jpg",
    },
    {
      id: "user4",
      profileImg: "resources/icons/FB_IMG_1516870992875.jpg",
    },
    {
      id: "user5",
      profileImg: "resources/icons/아이유앨범커버3.jpg",
    },
    {
      id: "user6",
      profileImg: "resources/icons/아이유앨범커버4.jpg",
    },
    {
      id: "user7",
      profileImg: "resources/icons/FB_IMG_1516870992875.jpg",
    },
    {
      id: "user8",
      profileImg: "resources/icons/아이유앨범커버1.jpg",
    },
  ];
  const [searchedFollowers, setSearchedFollowers] = useState(allFollowersData);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const filteredFollowers = allFollowersData.filter((follower) =>
      follower.id.includes(searchText)
    );
    setSearchedFollowers(filteredFollowers);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchedFollowers(allFollowersData);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  return (
    <div className="myinfo-fallower-modal-body">
      <FallowerModalSearchbar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onSearch={handleSearch}
        onResetSearch={handleResetSearch}
      />

      <div className="myinfo-fallower-list">
        {searchedFollowers.length === 0 ? (
          <div className="myinfo-fallow-list-no-results">
            검색 결과가 없습니다.
          </div>
        ) : (
          searchedFollowers.map((follower) => (
            <div key={follower.id} className="myinfo-fallower-list-content">
              <div className="myinfo-fallower-list-img-area">
                <img
                  className="myinfo-fallower-list-img"
                  src={follower.profileImg}
                  alt={`Profile of ${follower.id}`}
                />
              </div>
              <div className="myinfo-fallower-list-id">
                <span>{follower.id}</span>
              </div>
              <div className="myinfo-fallower-list-btn">
                <button>팔로우</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FallowerListModal;
