import "../FallowModal.css";
import React, { useState } from "react";
import FallowModalSearchbar from "./FallowModalSearchbar";

function FallowListModal() {
  // 임의의 팔로워 데이터 생성
  const allFollowsData = [
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
  const [searchedFollows, setSearchedFollows] = useState(allFollowsData);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const filteredFollows = allFollowsData.filter((follow) =>
      follow.id.includes(searchText)
    );
    setSearchedFollows(filteredFollows);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchedFollows(allFollowsData);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  return (
    <div className="myinfo-fallow-modal-body">
      <FallowModalSearchbar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onSearch={handleSearch}
        onResetSearch={handleResetSearch}
      />

      <div className="myinfo-fallow-list">
        {searchedFollows.length === 0 ? (
          <div className="myinfo-fallow-list-no-results">
            검색 결과가 없습니다.
          </div>
        ) : (
          searchedFollows.map((follow) => (
            <div key={follow.id} className="myinfo-fallow-list-content">
              <div className="myinfo-fallow-list-img-area">
                <img
                  className="myinfo-fallow-list-img"
                  src={follow.profileImg}
                  alt={`Profile of ${follow.id}`}
                />
              </div>
              <div className="myinfo-fallow-list-id">
                <span>{follow.id}</span>
              </div>
              <div className="myinfo-fallow-list-btn">
                <button>팔로우</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FallowListModal;
