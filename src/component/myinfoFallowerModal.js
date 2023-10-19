import "../FallowModal.css";
import Button from "react-bootstrap/Button";
import FallowModalSearchbar from "./FallowModalSearchbar";
import FallowerListModal from "./FallowerListModal";
import { useAuth } from "../LoginContext.js";

function MyinfoFallowerModal({ onClose, followersData, onFollowClick }) {
  const { user } = useAuth();

  return (
    <div className="myinfo-fallower-modal">
      <div className="myinfo-fallower-modal-header">
        <p>팔로워</p>
        <div>
          <button
            type="button"
            className="btn-close myinfo-fallower-modal-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>

      {/* FallowerListModal에 onFollowClick 함수 전달 */}
      <FallowerListModal
        followersData={followersData}
        onFollowClick={onFollowClick}
      />
    </div>
  );
}

export default MyinfoFallowerModal;
