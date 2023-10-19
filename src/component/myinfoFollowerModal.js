import "../FollowModal.css";
import FollowerModalSearchbar from "./FollowerModalSearchbar";
import FollowerListModal from "./FollowerListModal";
import { useAuth } from "../LoginContext.js";

function MyinfoFollowerModal({
  onFollow,
  onClose,
  followersData,
  followedMembers,
  setFollowedMembers,
  isVisitor,
  propsMyItems,
  updateFollowButton,
  updateFollowButtonClass,
}) {
  const { user } = useAuth();

  return (
    <div className="myinfo-follower-modal">
      <div className="myinfo-follower-modal-header">
        <p>팔로워</p>
        <div>
          <button
            type="button"
            className="btn-close myinfo-follower-modal-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
      <FollowerListModal
        onFollow={onFollow}
        followersData={followersData}
        followedMembers={followedMembers}
        setFollowedMembers={setFollowedMembers}
        isVisitor={isVisitor}
        propsMyItems={propsMyItems}
        updateFollowButton={updateFollowButton}
        onClose={onClose}
        updateFollowButtonClass={updateFollowButtonClass}
      />
    </div>
  );
}

export default MyinfoFollowerModal;
