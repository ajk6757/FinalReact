import "../FollowModal.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../LoginContext.js";

function FollowerModalSearchbar({
  searchText,
  onSearchTextChange,
  onSearch,
  onResetSearch,
}) {
  //밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();
  const handleSearchInputChange = (event) => {
    const text = event.target.value;
    onSearchTextChange(text);
  };

  useEffect(() => {
    // searchText가 변경되었을 때에만 작업을 수행하도록 조건을 추가
    if (searchText.length > 0) {
      onSearch();
    } else {
      onResetSearch();
    }
  }, [searchText]); // searchText만을 의존성 배열에 포함

  const handleResetIconClick = () => {
    onSearchTextChange("");
  };

  return (
    <div className="myinfo-follower-modal-search-area">
      <div className="myinfo-follower-modal-search">
        <input
          type="text"
          placeholder="검색"
          value={searchText}
          onChange={handleSearchInputChange}
        />
        {searchText && (
          <button
            type="button"
            className="myinfo-follow-modal-search-reset-icon"
            onClick={handleResetIconClick}
          >
            <img
              src="http://localhost:8082/Muzip/resources/image/search-reset-icon.png"
              alt="초기화"
            />
          </button>
        )}
      </div>
    </div>
  );
}

FollowerModalSearchbar.propTypes = {
  searchText: PropTypes.string,
  onSearchTextChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onResetSearch: PropTypes.func.isRequired,
  searchResultEmpty: PropTypes.bool.isRequired,
};

export default FollowerModalSearchbar;
