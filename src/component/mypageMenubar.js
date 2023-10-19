import React, { useState, useEffect } from "react";
import { PiPlaylistLight, PiHeartLight, PiArticleLight } from "react-icons/pi";
import { useAuth } from "../LoginContext.js";

function MypageMenubar({ onMenuClick, pageUserNo }) {
  const [activeMenu, setActiveMenu] = useState("feed");
  const { user } = useAuth();
  const handleMenuClick = (menu) => {
    onMenuClick(menu);
    setActiveMenu(menu);
  };
  useEffect(() => {
    onMenuClick("feed");
    setActiveMenu("feed");
  }, [pageUserNo]);
  return (
    <div className="mypage-menubar">
      <div
        className={`mypage-gohome ${activeMenu === "feed" ? "active" : ""}`}
        onClick={() => handleMenuClick("feed")}
      >
        <PiArticleLight />
      </div>
      <div
        className={`mypage-myfav ${activeMenu === "myfav" ? "active" : ""}`}
        onClick={() => handleMenuClick("myfav")}
      >
        <PiHeartLight />
      </div>
      <div
        className={`mypage-myplaylist ${
          activeMenu === "myplaylist" ? "active" : ""
        }`}
        onClick={() => handleMenuClick("myplaylist")}
      >
        <PiPlaylistLight />
      </div>
    </div>
  );
}

export default MypageMenubar;
