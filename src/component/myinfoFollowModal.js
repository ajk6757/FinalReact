import "../FollowModal.css";
import FollowModalSearchbar from "./FollowModalSearchbar";
import FollowListModal from "./FollowListModal";
import { useAuth } from "../LoginContext.js";
import React, { useState } from "react";

function MyinfofollowModal({
  onClose,
  followedMembers,
  onUnfollow,
  updateFollowButton,
  isUnfollowConfirmation,
  setIsUnfollowConfirmation,
  isVisitor,
  propsMyItems,
}) {
  const { user } = useAuth();

  return (
    <div className="myinfo-follow-modal">
      <div className="myinfo-follow-modal-header">
        <p>팔로우</p>
        <div>
          <button
            type="button"
            className="btn-close myinfo-follow-modal-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>

      <FollowListModal
        followedMembers={followedMembers}
        onUnfollow={onUnfollow}
        updateFollowButton={updateFollowButton}
        isUnfollowConfirmation={isUnfollowConfirmation}
        setIsUnfollowConfirmation={setIsUnfollowConfirmation}
        isVisitor={isVisitor}
        propsMyItems={propsMyItems}
        onClose={onClose}
      />
    </div>
  );
}

export default MyinfofollowModal;
