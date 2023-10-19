import "../FallowModal.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function FallowerModalSearchbar({
  searchText,
  onSearchTextChange,
  onSearch,
  onResetSearch,
}) {
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
    <div className="myinfo-fallower-modal-search-area">
      <div className="myinfo-fallower-modal-search">
        <input
          type="text"
          placeholder="검색"
          value={searchText}
          onChange={handleSearchInputChange}
        />
        {searchText && (
          <button
            type="button"
            className="myinfo-fallow-modal-search-reset-icon"
            onClick={handleResetIconClick}
          >
            <img src="resources/icons/search-reset-icon.png" alt="초기화" />
          </button>
        )}
      </div>
    </div>
  );
}

FallowerModalSearchbar.propTypes = {
  searchText: PropTypes.string,
  onSearchTextChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onResetSearch: PropTypes.func.isRequired,
  searchResultEmpty: PropTypes.bool.isRequired,
};

export default FallowerModalSearchbar;
