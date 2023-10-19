import "../main.css";
import { BsPersonLinesFill } from "react-icons/bs";
import { PiBookOpenText } from "react-icons/pi";
import {
  AiOutlinePlusSquare,
  AiOutlineSetting,
  AiOutlineHome,
} from "react-icons/ai";
import { BsCloudPlus } from "react-icons/bs";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineBellAlert,
} from "react-icons/hi2";

function Menubar() {
  return (
    <div id="menubar">
      <ul>
        <button>
          <li>
            <div className="logo">
              <p>Muzip.</p>
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <AiOutlineHome size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <PiBookOpenText size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <AiOutlinePlusSquare size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <BsPersonLinesFill size={28} />
            </div>
          </li>
        </button>

        <button>
          <li>
            <div>
              <BsCloudPlus size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <HiOutlineChatBubbleLeftRight size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <HiOutlineBellAlert size={28} />
            </div>
          </li>
        </button>
        <button>
          <li>
            <div>
              <AiOutlineSetting size={28} />
            </div>
          </li>
        </button>
      </ul>
    </div>
  );
}

export default Menubar;
