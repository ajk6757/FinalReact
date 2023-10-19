import "../FallowModal.css";
import Button from "react-bootstrap/Button";
import FallowModalSearchbar from "./FallowModalSearchbar";
import FallowListModal from "./FallowListModal";
import { useAuth } from "../LoginContext.js";
import React, { useState } from "react";

function MyinfoFallowModal({ onClose, followedMembers }) {
  //밑에 로그인 유저 데이터 받아오는거임
  const { user } = useAuth();

  return (
    <div className="myinfo-fallow-modal">
      <div className="myinfo-fallow-modal-header">
        <p>팔로우</p>
        <div>
          <button
            type="button"
            className="btn-close myinfo-fallow-modal-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>

      <FallowListModal followedMembers={followedMembers} />
    </div>
  );
}

export default MyinfoFallowModal;
