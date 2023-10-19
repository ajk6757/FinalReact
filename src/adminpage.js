import "./App.css";
import {
  BrowserRouter,
  useLocation,
  Link,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import $ from "jquery";
import {
  React,
  useEffect,
  useState,
  useRef,
  useDispatch,
  useSelector,
  useCallback,
} from "react";
import { FiAlertCircle, FiSearch, FiFilter } from "react-icons/fi";
import { FcCancel, FcCheckmark, FcSearch } from "react-icons/fc";
import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Paging from "./paging";
import "./adminpage.css";
import { HiSearch } from "react-icons/hi";
import { MdFilterListAlt } from "react-icons/md";

export const Adminpage = (props) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { setBtnFocus } = props;
  const [changecolor, setchangecolor] = useState("firstClick");

  useEffect(() => {
    const liElements = document.querySelectorAll("#settingList li");
    liElements.forEach((liElement) => {
      if (liElement.id === changecolor) {
        liElement.classList.add("settingListBtnClick");
      } else {
        liElement.classList.remove("settingListBtnClick");
      }
    });
  }, [changecolor]);

  const bgColorChange = (e) => {
    setchangecolor(e.target.id);
  };

  const handleLogout = () => {
    logout();
    alert("로그아웃 성공");
    setBtnFocus({ id: "/" });
    navigate("/");
    function toHome1() {
      $("#muzipbar").css({
        width: "16vw",
        height: "2.8vw",
        "background-color": "#000000",
        "border-radius": "1.5vw",
      });
    }
    function toHome2() {
      $("#muzipbar").css({ width: "13vw", height: "2.8vw" });
    }
    function toHome3() {
      $("#muzipbar").css({ width: "14vw", height: "2.8vw" });
    }
    function fadeOutAll() {
      $("#muzipbar-normal").fadeOut(100);
      $("#muzipbar-player").fadeOut(30);
      $("#muzipbar-lyrics").fadeOut(100);
      $("#muzipbar-playList").fadeOut(100);
      $("#muzipbar-recommend").fadeOut(100);
      $("#muzipbar-addPlayListSong").fadeOut(100);
      $("#muzipbar-myPlayListContent").fadeOut(100);
      $("#muzipbar-addNewPlayList").fadeOut(100);
    }
    fadeOutAll();
    setTimeout(() => fadeOutAll(), 450);
    setTimeout(() => toHome1(), 450);
    setTimeout(() => toHome2(), 650);
    setTimeout(() => toHome3(), 850);
    setTimeout(() => {
      $("#muzipbar-normal").fadeIn();
    }, 850);
  };

  return (
    <div id="settingWrap">
      <div id="settingList">
        <ul>
          <Link to={"/adminpage/managemember"}>
            <li id="firstClick" onClick={bgColorChange}>
              회원 관리
            </li>
          </Link>
          <Link to={"/adminpage/managecontent"}>
            <li id="settingClick" onClick={bgColorChange}>
              게시글 관리
            </li>
          </Link>
          <Link to={"/adminpage/managemusic"}>
            <li id="membershipClick" onClick={bgColorChange}>
              음악 관리
            </li>
          </Link>
          <Link to={"/adminpage/managecomplain"}>
            <li id="CoInfoClick" onClick={bgColorChange}>
              문의내역
            </li>
          </Link>
          <Link to={"/adminpage/managepayment"}>
            <li id="withdrawalClick" onClick={bgColorChange}>
              결제 관리
            </li>
          </Link>
          <li className="logoutBtn" onClick={handleLogout}>
            로그아웃
          </li>
        </ul>
      </div>
      <div id="settingItem">
        {location.pathname == "/adminpage" ? <ManageMember /> : <Outlet />}
      </div>
    </div>
  );
};

//회원관리
export const ManageMember = () => {
  const [originalList, setOriginalList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [memberList, setMemberList] = useState([]);
  const [listcount, setListcount] = useState();

  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState(); // 클릭한 행의 데이터를 저장
  const [searchMember, setSearchMember] = useState("");

  // 모달 열기
  const handleModalOpen = (data) => {
    setShowModal(true);
    setRowData(data);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  function selectMemberListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectMemberListCount",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }

  function selectMemberList() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectMemberList",
        {
          currentPage: page,
          sortBy: selectedFilter, // 정렬 옵션 추가
          searchTerm: searchMember, // 검색어 추가
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setMemberList(data);
        setOriginalList(data); // 원본 데이터 저장
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    selectMemberListCount();
    selectMemberList();
  }, [page, selectedFilter, searchMember]);

  //정렬바꾸는 기능
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    setPage(1); // 정렬이 바뀌면 첫 페이지로 돌아갑니다.
  };

  //검색기능
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMemberSearch();
    }
  };
  const handleMemberSearch = () => {
    selectMemberList();
  };

  const handleSearchInputChange = (e) => {
    setSearchMember(e.target.value);
  };

  return (
    <div>
      <div className="admin_title_area">
        <h3 className="admin_title">회원관리</h3>
      </div>
      <div className="admin_membersearch_area">
        <div className="admin_member_filter">
          <MdFilterListAlt size={20} />
          <select
            name="admin_member_filter_aco"
            id="admin_member_filter_aco"
            onChange={handleFilterChange}
          >
            <option value="default">기본 정렬</option>
            <option value="userNo">회원번호</option>
            <option value="userName">닉네임</option>
            <option value="userId">아이디</option>
          </select>
        </div>
        <div className="admin_membersearch_bar">
          <input
            type="search"
            placeholder="회원을 검색해주세요."
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            value={searchMember}
          />
          <button
            className="admin_membersearch_btn"
            onClick={handleMemberSearch}
          >
            <HiSearch size={20} id="HiSearch" />
          </button>
        </div>
      </div>
      <div className="admin_table_area">
        <table className="admin_tb">
          <thead>
            <tr>
              <td>회원번호</td>
              <td>아이디</td>
              <td>닉네임</td>
              <td>이메일</td>
              <td>멤버십 등급</td>
            </tr>
          </thead>
          <tbody>
            {memberList.map((item, index) => (
              <tr key={item.userNo} onClick={() => handleModalOpen(item)}>
                <td>{item.userNo}</td>
                <td>{item.userId}</td>
                <td>{item.userName}</td>
                <td>{item.email}</td>
                <td>{item.membershipNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paging page={page} count={listcount} setPage={setPage} />
      {rowData && (
        <MemberCustomModal
          show={showModal}
          handleClose={handleModalClose}
          content={rowData}
          selectMemberList={selectMemberList}
        />
      )}
    </div>
  );
};

//클릭시 열리는 회원관리 모달창
const MemberCustomModal = ({
  show,
  handleClose,
  content,
  selectMemberList,
}) => {
  const formRef1 = useRef(null);

  // value={content.status}

  // content로 전달받은 회원 정보로 member 상태를 업데이트
  useEffect(() => {
    setMember(content);
  }, [content]);

  const [member, setMember] = useState(content);

  useEffect(() => {
    // content가 변경될 때만 실행
    if (formRef1.current) {
      formRef1.current.querySelector('[name="userNo"]').value = member.userNo;
      formRef1.current.querySelector('[name="userId"]').value = member.userId;
      formRef1.current.querySelector('[name="userName"]').value =
        member.userName;
      formRef1.current.querySelector('[name="email"]').value = member.email;
      formRef1.current.querySelector('[name="membershipNo"]').value =
        member.membershipNo;
      formRef1.current.querySelector('[name="status"]').value = member.status;
    }
  }, [member]);

  function updateMemberinfo(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/updateMemberinfo",
        {
          userNo: formData.get("userNo"),
          userId: formData.get("userId"),
          userName: formData.get("userName"),
          email: formData.get("email"),
          membershipNo: formData.get("membershipNo"),
          status: formData.get("status"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectMemberList();
        setMember({
          userNo: formData.get("userNo"),
          userId: formData.get("userId"),
          userName: formData.get("userName"),
          email: formData.get("email"),
          membershipNo: formData.get("membershipNo"),
          status: formData.get("status"),
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function WithdrawalMemberinfo(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/WithdrawalMemberinfo",
        {
          userNo: formData.get("userNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectMemberList();
        setMember({
          userNo: formData.get("userNo"),
          userId: formData.get("userId"),
          userName: formData.get("userName"),
          email: formData.get("email"),
          membershipNo: formData.get("membershipNo"),
          status: "N",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function RestoreMemberinfo(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/RestoreMemberinfo",
        {
          userNo: formData.get("userNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectMemberList();
        setMember({
          userNo: formData.get("userNo"),
          userId: formData.get("userId"),
          userName: formData.get("userName"),
          email: formData.get("email"),
          membershipNo: formData.get("membershipNo"),
          status: "Y",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Modal className="admin_modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton className="admin_member_modal_hd">
        <Modal.Title className="admin_member_modal_title">
          회원 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form ref={formRef1} onSubmit={(e) => updateMemberinfo(e)}>
          <div id="admin_memberinfo">
            <table>
              <tbody>
                <tr>
                  <td>회원 번호</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="userNo"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>회원 아이디</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="userId"
                    />
                  </td>
                </tr>
                <tr>
                  <td>회원 닉네임</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="userName"
                    />
                  </td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="email"
                    />
                  </td>
                </tr>
                <tr>
                  <td>멤버십 등급</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="membershipNo"
                    />
                  </td>
                </tr>
                <tr>
                  <td>활동 상태</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="status"
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="admin_btn_area">
              <button type="submit">회원정보수정</button>
              <button onClick={WithdrawalMemberinfo}>회원탈퇴</button>
              <button onClick={RestoreMemberinfo}>회원복구</button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// 글관리
export const ManageContent = () => {
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [contentList, setContentList] = useState([]);
  const [listcount, setListcount] = useState();

  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState(); // 클릭한 행의 데이터를 저장
  const [searchContent, setSearchContent] = useState("");
  const [searchType, setSearchType] = useState("boardNo");

  // 모달 열기
  const handleModalOpen = (data) => {
    setShowModal(true);
    setRowData(data);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  function Short(String) {
    if (String.length <= 10) {
      return String;
    } else {
      return String.substring(0, 10) + "...";
    }
  }

  function selectContentListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectContentListCount",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }

  function selectContentList() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectContentList",
        {
          currentPage: page,
          sortBy: selectedFilter,
          searchTerm: searchContent,
          searchType: searchType, //검색타입
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setContentList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    selectContentListCount();
    selectContentList();
  }, [page, selectedFilter, searchContent, searchType]);

  //정렬바꾸는 기능
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    setPage(1); // 정렬이 바뀌면 첫 페이지로 돌아갑니다.
  };

  //검색기능
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleContentSearch();
    }
  };
  // const handleContentSearch = () => {
  //   selectContentList();
  // };

  const handleSearchInputChange = (e) => {
    setSearchContent(e.target.value);
  };

  const handleContentSearch = () => {
    setPage(1); // 검색을 시작할 때 페이지를 1로 설정
    selectContentList();
  };

  return (
    <div>
      <div className="admin_title_area">
        <h3 className="admin_title">게시글 관리</h3>
      </div>
      <div className="admin_membersearch_area">
        <div className="admin_member_filter">
          <MdFilterListAlt size={20} />
          <select
            name="admin_member_filter_aco"
            id="admin_member_filter_aco"
            onChange={handleFilterChange}
          >
            <option value="default">기본 정렬</option>
            <option value="boardNo">게시글 번호</option>
            <option value="userId">아이디</option>
            <option value="createDate">작성 날짜 </option>
          </select>
        </div>
        <div className="admin_membersearch_bar_area">
          <div className="admin_search_filter">
            <select
              name="search_type"
              id="search_type"
              onChange={handleSearchTypeChange}
            >
              <option value="boardNo">게시글 번호</option>
              <option value="userId">아이디</option>
              <option value="boardContent">게시글 내용</option>
              <option value="createDate">작성 날짜</option>
            </select>
          </div>
          <div className="admin_membersearch_bar">
            <input
              type="search"
              placeholder="게시글을 검색해주세요."
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              value={searchContent}
            />
            <button
              className="admin_membersearch_btn"
              onClick={handleContentSearch}
            >
              <HiSearch size={20} id="HiSearch" />
            </button>
          </div>
        </div>
      </div>
      <table className="admin_tb">
        <thead>
          <tr>
            <td>게시글 번호</td>
            <td>작성자 아이디</td>
            <td>게시글 내용</td>
            <td>작성 날짜</td>
            <td>비밀글 설정</td>
            <td>음악 번호</td>
            <td>등록 상태</td>
          </tr>
        </thead>
        <tbody>
          {contentList.map((item, index) => (
            <tr
              key={item.boardNo}
              onClick={() => handleModalOpen(contentList[index])}
            >
              <td>{item.boardNo}</td>
              <td>{item.userId}</td>
              <td>{Short(item.boardContent)}</td>
              <td>{item.createDate}</td>
              <td>{item.secret}</td>
              <td>{item.musicNo}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paging page={page} count={listcount} setPage={setPage} />
      {rowData && (
        <ContentCustomModal
          show={showModal}
          handleClose={handleModalClose}
          content={rowData}
          selectContentListCount={selectContentListCount}
        />
      )}
    </div>
  );
};

//클릭시 열리는 글관리 모달창
const ContentCustomModal = ({
  show,
  handleClose,
  content,
  selectContentListCount,
}) => {
  const formRef1 = useRef(null);

  // value={content.status}

  const [board, setBoard] = useState(content);

  useEffect(() => {
    // content가 변경될 때만 실행
    if (formRef1.current) {
      formRef1.current.querySelector('[name="boardNo"]').value = board.boardNo;
      formRef1.current.querySelector('[name="userId"]').value = board.userId;
      formRef1.current.querySelector('[name="boardContent"]').value =
        board.boardContent;
      formRef1.current.querySelector('[name="createDate"]').value =
        board.createDate;
      formRef1.current.querySelector('[name="secret"]').value = board.secret;
      formRef1.current.querySelector('[name="musicNo"]').value = board.musicNo;
      formRef1.current.querySelector('[name="status"]').value = board.status;
    }
  });

  function adminDeleteContent(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/adminDeleteContent",
        {
          boardNo: formData.get("boardNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectContentListCount();
        setBoard({
          boardNo: formData.get("boardNo"),
          userId: formData.get("userId"),
          boardContent: formData.get("boardContent"),
          createDate: formData.get("createDate"),
          secret: formData.get("secret"),
          musicNo: formData.get("musicNo"),
          status: "N",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function adminRestoreContent(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/adminRestoreContent",
        {
          boardNo: formData.get("boardNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectContentListCount();
        setBoard({
          boardNo: formData.get("boardNo"),
          userId: formData.get("userId"),
          boardContent: formData.get("boardContent"),
          createDate: formData.get("createDate"),
          secret: formData.get("secret"),
          musicNo: formData.get("musicNo"),
          status: "Y",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Modal className="admin_modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton className="admin_member_modal_hd">
        <Modal.Title className="admin_member_modal_title">
          게시글 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form ref={formRef1}>
          <div id="admin_memberinfo">
            <table>
              <tbody>
                <tr>
                  <td>게시글 번호</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="boardNo"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>작성자 아이디</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="userId"
                    />
                  </td>
                </tr>
                <tr>
                  <td>게시글 내용</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="boardContent"
                    />
                  </td>
                </tr>
                <tr>
                  <td>작성 날짜</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="createDate"
                    />
                  </td>
                </tr>
                <tr>
                  <td>비밀글 설정</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="secret"
                    />
                  </td>
                </tr>
                <tr>
                  <td>음악 번호</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="musicNo"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>등록 상태</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="status"
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="admin_btn_area">
              <button onClick={adminDeleteContent}>게시글 삭제</button>
              <button onClick={adminRestoreContent}>게시글 복원</button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// 음악관리
export const ManageMusic = () => {
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [musicList, setMusicList] = useState([]);
  const [listcount, setListcount] = useState();

  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState(); // 클릭한 행의 데이터를 저장
  const [searchMusic, setSearchMusic] = useState("");
  const [searchType, setSearchType] = useState("musicNo");

  // 모달 열기
  const handleModalOpen = (data) => {
    console.log("Opening modal with data:", data); // 이 부분 추가
    setShowModal(true);
    setRowData(data);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  function selectMusicListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectMusicListCount",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }

  function selectMusicList() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectMusicList",
        {
          currentPage: page,
          sortBy: selectedFilter,
          searchTerm: searchMusic,
          searchType: searchType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMusicList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    selectMusicListCount();
    selectMusicList();
  }, [page, selectedFilter, searchMusic, searchType]);

  //정렬바꾸는 기능
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    setPage(1); // 정렬이 바뀌면 첫 페이지로 돌아갑니다.
  };

  //검색기능
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMusicSearch();
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchMusic(e.target.value);
  };

  const handleMusicSearch = () => {
    setPage(1);
    selectMusicList();
  };

  return (
    <div>
      <div className="admin_title_area">
        <h3 className="admin_title">음악 관리</h3>
      </div>
      <div className="admin_membersearch_area">
        <div className="admin_member_filter">
          <MdFilterListAlt size={20} />
          <select
            name="admin_member_filter_aco"
            id="admin_member_filter_aco"
            onChange={handleFilterChange}
          >
            <option value="default">기본 정렬</option>
            <option value="musicNo">음악 번호</option>
            <option value="musicTitle">음악 제목</option>
            <option value="musicArtist">아티스트 </option>
          </select>
        </div>
        <div className="admin_membersearch_bar_area">
          <div className="admin_search_filter">
            <select
              name="search_type"
              id="search_type"
              onChange={handleSearchTypeChange}
            >
              <option value="musicNo">음악 번호</option>
              <option value="musicTitle">음악 제목</option>
              <option value="musicArtist">아티스트</option>
              <option value="enrollDate">등록 날짜</option>
              <option value="genre">장르</option>
            </select>
          </div>
          <div className="admin_membersearch_bar">
            <input
              type="search"
              placeholder="게시글을 검색해주세요."
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              value={searchMusic}
            />
            <button
              className="admin_membersearch_btn"
              onClick={handleMusicSearch}
            >
              <HiSearch size={20} id="HiSearch" />
            </button>
          </div>
        </div>
      </div>
      <table className="admin_tb">
        <thead>
          <tr>
            <td>음악 번호</td>
            <td>음악 제목</td>
            <td>아티스트</td>
            <td>등록 날짜</td>
            <td>장르</td>
            <td>등록 상태</td>
          </tr>
        </thead>
        <tbody>
          {console.log(musicList)}
          {musicList.map((item, index) => (
            <tr
              key={item.musicNo}
              onClick={() => handleModalOpen(musicList[index])}
            >
              <td>{item.musicNo}</td>
              <td>{item.musicTitle}</td>
              <td>{item.musicArtist}</td>
              <td>{item.enrollDate}</td>
              <td>{item.genre}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paging page={page} count={listcount} setPage={setPage} />
      {rowData && (
        <MusicCustomModal
          show={showModal}
          handleClose={handleModalClose}
          content={rowData}
          selectMusicListCount={selectMusicListCount}
        />
      )}
    </div>
  );
};

//클릭시 열리는 음악관리 모달창
const MusicCustomModal = ({
  show,
  handleClose,
  content,
  selectMusicListCount,
}) => {
  const formRef1 = useRef(null);

  // value={content.status}

  const [music, setMusic] = useState(content);

  useEffect(() => {
    console.log("Received content in modal:", content); // 이 부분 추가
    // content가 변경될 때만 실행
    if (formRef1.current) {
      formRef1.current.querySelector('[name="musicNo"]').value = music.musicNo;
      formRef1.current.querySelector('[name="musicTitle"]').value =
        music.musicTitle;
      formRef1.current.querySelector('[name="musicArtist"]').value =
        music.musicArtist;
      formRef1.current.querySelector('[name="enrollDate"]').value =
        music.enrollDate;
      formRef1.current.querySelector('[name="genre"]').value = music.genre;
      formRef1.current.querySelector('[name="status"]').value = music.status;
      const lyrics = music.musicLyrics.replaceAll("<br>", "\n");
      formRef1.current.querySelector('[name="musicLyrics"]').value = lyrics;
    }
  });
  useEffect(() => {
    setMusic(content);
  }, [content]);
  function adminDeleteMusic(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/adminDeleteMusic",
        {
          musicNo: formData.get("musicNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectMusicListCount();
        setMusic({
          musicNo: formData.get("musicNo"),
          musicTitle: formData.get("musicTitle"),
          musicArtist: formData.get("musicArtist"),
          enrollDate: formData.get("enrollDate"),
          genre: formData.get("genre"),
          status: "N",
          musicLyrics: formData.get("musicLyrics"),
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function adminRestoreMusic(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/adminRestoreMusic",
        {
          musicNo: formData.get("musicNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectMusicListCount();
        setMusic({
          musicNo: formData.get("musicNo"),
          musicTitle: formData.get("musicTitle"),
          musicArtist: formData.get("musicArtist"),
          enrollDate: formData.get("enrollDate"),
          genre: formData.get("genre"),
          status: "Y",
          musicLyrics: formData.get("musicLyrics"),
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const [coverFile, setCoverFile] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const imageUrl = "http://localhost:8082/Muzip";

  function updateMusic() {
    handleSubmit();
  }

  const handleCoverFile = (e) => {
    setCoverFile(e.target.files[0]);
  };
  const handleMusicFile = (e) => {
    setMusicFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const updatedMusicNo =
      formRef1.current.querySelector('[name="musicNo"]').value;
    const updatedTitle = formRef1.current.querySelector(
      '[name="musicTitle"]'
    ).value;
    const updatedArtist = formRef1.current.querySelector(
      '[name="musicArtist"]'
    ).value;
    const updatedGenre = formRef1.current.querySelector('[name="genre"]').value;
    const updatedLyrics = formRef1.current.querySelector(
      '[name="musicLyrics"]'
    ).value;

    if (
      updatedTitle != undefined &&
      updatedTitle != "" &&
      updatedArtist != undefined &&
      updatedArtist != "" &&
      updatedLyrics != undefined &&
      updatedLyrics != ""
    ) {
      const updatedFormData = new FormData();
      if (coverFile !== null) {
        updatedFormData.append("cover", coverFile);
      }
      if (musicFile !== null) {
        updatedFormData.append("music", musicFile);
      }

      await axios
        .post(
          "http://localhost:3000/Muzip/updateMusic",
          {
            musicNo: updatedMusicNo,
            cover: updatedFormData.get("cover"),
            music: updatedFormData.get("music"),
            title: updatedTitle,
            artist: updatedArtist,
            lyrics: updatedLyrics,
            genre: updatedGenre,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          if (response.data != 0) {
            alert("음원이 수정되었습니다.");
          } else {
            alert("음원 등록에 실패하였습니다.");
          }
        })
        .catch(console.log);
    } else {
      alert("모든 항목을 작성해주세요.");
    }
  };

  const loadImg = (e) => {
    handleCoverFile(e);
    if (e.target.files.length == 1) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function (ev) {
          if (ev.target.result !== null)
            document.getElementById("updateCoverImagePreview").src =
              ev.target.result;
        };
      } catch (error) {
        /// alert(error.message); // 오류 메시지 출력
        $("#errorMsg").click();
      }
    }
  };

  return (
    <Modal className="admin_music_modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton className="admin_member_modal_hd">
        <Modal.Title className="admin_member_modal_title">
          음악 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form ref={formRef1}>
          <div id="admin_memberinfo">
            <div id="updateAlbumCoverWrap">
              <label htmlFor="updateAlbumCoverUpdate">
                <div id="updateAlbumCover">
                  {
                    <img
                      id="updateCoverImagePreview"
                      src={imageUrl + music.coverPath}
                    />
                  }
                </div>
              </label>
              <input
                type="file"
                name="udpateAlbumCoverUpdate"
                id="updateAlbumCoverUpdate"
                accept="image/*"
                onChange={loadImg}
              />
            </div>

            <div id="updateMusicSourceWrap">
              <div id="updateWMBW">
                <label htmlFor="updateMusicSource">
                  <div id="updateMusicBtn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-file-earmark-music-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z" />
                    </svg>
                    음원수정
                  </div>
                </label>
              </div>
              <input
                type="file"
                name="updateMusicSource"
                id="updateMusicSource"
                accept="audio/*"
                onChange={handleMusicFile}
              />
            </div>

            <input
              type="file"
              id="image-input"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function (event) {
                    document.getElementById("image-preview").src =
                      event.target.result;
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <table>
              <tbody>
                <tr>
                  <td className="adminMusicDetail">음악 번호</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="musicNo"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="adminMusicDetail">음악 제목</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="musicTitle"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="adminMusicDetail">아티스트</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="musicArtist"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="adminMusicDetail">등록 날짜</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="enrollDate"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="adminMusicDetail">장르</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="genre"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="adminMusicDetail">등록 상태</td>
                  <td>
                    <input
                      type="text"
                      className="memberListDetail"
                      name="status"
                      readOnly
                    />
                  </td>
                </tr>
                <tr className="admin_music_lyrics">
                  <td className="adminMusicDetail">가사</td>
                  <td className="lyricsArea">
                    <textarea className="memberListDetail" name="musicLyrics" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="admin_btn_area">
              <button onClick={adminDeleteMusic}>음악 삭제</button>
              <button onClick={adminRestoreMusic}>음악 복원</button>
              <button onClick={updateMusic}>음악 수정</button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// 문의내역관리
export const ManageComplain = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [contactList, setContactList] = useState([]);
  const [listcount, setListcount] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen1, setModalOpen1] = useState(false);
  const [contactDetail, setContactDetail] = useState();
  const [formData, setFormData] = useState({
    category: "title", // 초기값 설정
    researchinput: "", // 초기값 설정
  });
  const [research, setResearch] = useState({
    category: "title",
    researchinput: "",
  });
  const formRef1 = useRef(null);
  const [handlechange, setHandlechange] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const openContactDetail = (data) => {
    setContactDetail(data);
    setModalOpen1(true);
  };

  useEffect(() => {
    console.log(contactDetail);
    selectContactListCount();
    selectContactList();
  }, [contactDetail]);

  const closeContactDetail = () => {
    setModalOpen1(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  //검색 정보 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //내용 간략화 함수
  function Short(String) {
    if (String)
      if (String.length <= 10) {
        return String;
      } else {
        return String.substring(0, 10) + "...";
      }
  }

  //검색
  function selectListandresearch() {
    if (formData.researchinput === "") {
      // researchinput에 값이 없는 경우, 초기값으로 설정
      setResearch({
        category: formData.category,
        researchinput: "",
      });
    } else {
      // researchinput에 값이 있는 경우, 입력된 값으로 설정
      setResearch({
        category: formData.category,
        researchinput: formData.researchinput,
      });
    }
    setPage(1);
  }

  const handleonKeyDown = (e) => {
    if (e.key === "Enter") {
      selectListandresearch(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  //문의목록개수
  function selectContactListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectContactListCount",
        {
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }
  //문의목록
  function selectContactList() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectContactList",
        {
          currentPage: page,
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setContactList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //페이지 이동시 목록 다시 받기
  useEffect(() => {
    selectContactListCount();
    selectContactList();
  }, [page]);

  //검색할때마다 목록 다시 받기
  useEffect(() => {
    selectContactListCount();
    selectContactList();
  }, [research]);

  //문의 상세 내역
  const [contact, setContact] = useState(contactDetail);

  //문의 답변 업데이트
  function updateAdminReply(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/updateAdminReply",
        {
          contactNo: formData.get("contactNo"),
          adminReply: formData.get("adminReply"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        setContactDetail({
          contactNo: formData.get("contactNo"),
          userId: formData.get("userId"),
          contactTitle: formData.get("contactTitle"),
          contactCont: formData.get("contactCont"),
          adminReply: formData.get("adminReply"),
          status: formData.get("status"),
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //문의삭제
  function DeleteContact(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/DeleteContact",
        {
          contactNo: formData.get("contactNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectContactListCount();
        setContactDetail({
          contactNo: formData.get("contactNo"),
          userId: formData.get("userId"),
          contactTitle: formData.get("contactTitle"),
          contactCont: formData.get("contactCont"),
          adminReply: formData.get("adminReply"),
          status: "N",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //문의복구
  function RestoreContact(e) {
    e.preventDefault();
    const formData = new FormData(formRef1.current);

    axios
      .post(
        "http://localhost:3000/Muzip/RestoreContact",
        {
          contactNo: formData.get("contactNo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        alert(data.message);
        selectContactListCount();
        setContactDetail({
          contactNo: formData.get("contactNo"),
          userId: formData.get("userId"),
          contactTitle: formData.get("contactTitle"),
          contactCont: formData.get("contactCont"),
          adminReply: formData.get("adminReply"),
          status: "Y",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <div className="admin_title_area">
        <h3 className="admin_title">문의관리</h3>
      </div>
      <div className="admin_membersearch_area">
        <div className="admin_member_filter"></div>
        <div className="admin_membersearch_bar_area">
          <div className="admin_search_filter">
            <select name="category" onChange={handleInputChange}>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="userId">아이디</option>
            </select>
          </div>
          <div className="admin_membersearch_bar">
            <input
              type="search"
              placeholder="검색어를 입력해주세요."
              name="researchinput"
              onChange={handleInputChange}
              onKeyDown={handleonKeyDown}
            />
            <button
              className="admin_membersearch_btn"
              onClick={selectListandresearch}
            >
              <HiSearch size={20} id="HiSearch" />
            </button>
          </div>
        </div>
      </div>
      <div className="admin_table_area">
        <table className="admin_tb">
          <thead>
            <tr>
              <td>문의번호</td>
              <td>아이디</td>
              <td>제목</td>
              <td>내용</td>
              <td>답변</td>
              <td>작성날짜</td>
            </tr>
          </thead>
          <tbody>
            {contactList.map((item, index) => (
              <tr
                key={item.contactNo}
                onClick={() => openContactDetail(contactList[index])}
              >
                <td>{item.contactNo}</td>
                <td>{item.userId}</td>
                <td>{item.contactTitle}</td>
                <td>{Short(item.contactCont)}</td>
                {!item.adminReply && <td>N</td>}
                {item.adminReply && <td>Y</td>}
                <td>{item.contactDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paging page={page} count={listcount} setPage={setPage} />

      {contactDetail && (
        <Modal
          show={isModalOpen1}
          onHide={closeContactDetail}
          className="admin_modal"
        >
          <Modal.Header closeButton className="admin_member_modal_hd">
            <Modal.Title className="admin_member_modal_title">
              문의 결과
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form ref={formRef1}>
              <div id="admin_memberinfo">
                <table>
                  <tbody>
                    <tr>
                      <td>문의번호</td>
                      <td>
                        <input
                          type="text"
                          name="contactNo"
                          value={contactDetail.contactNo}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>아이디</td>
                      <td>
                        <input
                          type="text"
                          name="userId"
                          value={contactDetail.userId}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>제목</td>
                      <td>
                        <input
                          type="text"
                          name="contactTitle"
                          value={contactDetail.contactTitle}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>내용 </td>
                      <td>
                        <input
                          type="text"
                          name="contactCont"
                          value={contactDetail.contactCont}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>답변</td>
                      <td>
                        <textarea
                          name="adminReply"
                          id="adminReply"
                          defaultValue={contactDetail.adminReply}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>상태</td>
                      <td>
                        <input
                          type="text"
                          name="status"
                          value={contactDetail.status}
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="admin_btn_area">
                  <button onClick={updateAdminReply}>답변 저장</button>
                  <button onClick={DeleteContact}>문의 삭제</button>
                  <button onClick={RestoreContact}>문의 복구</button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

// 결제관리
export const ManagePayment = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageinfo, setPageinfo] = useState();
  const [paymentList, setPaymentList] = useState([]);
  const [listcount, setListcount] = useState();
  // const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen1, setModalOpen1] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState();
  const [formData, setFormData] = useState({
    category: "userId", // 초기값 설정
    researchinput: "", // 초기값 설정
  });
  const [research, setResearch] = useState({
    category: "userId",
    researchinput: "",
  });
  const formRef1 = useRef(null);
  const [handlechange, setHandlechange] = useState(false);

  const openPaymentDetail = (data) => {
    setPaymentDetail(data);
    setModalOpen1(true);
  };

  useEffect(() => {
    selectPaymentListCount();
    selectPaymentList();
  }, [paymentDetail]);

  const closePaymentDetail = () => {
    setModalOpen1(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  //검색 정보 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //검색
  function selectListandresearch() {
    if (formData.researchinput === "") {
      // researchinput에 값이 없는 경우, 초기값으로 설정
      setResearch({
        category: formData.category,
        researchinput: "",
      });
    } else {
      // researchinput에 값이 있는 경우, 입력된 값으로 설정
      setResearch({
        category: formData.category,
        researchinput: formData.researchinput,
      });
    }
    setPage(1);
  }

  //엔터키로 검색
  const handleonKeyDown = (e) => {
    if (e.key === "Enter") {
      selectListandresearch(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  //결제목록개수
  function selectPaymentListCount() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectPaymentListCount",
        {
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setListcount(data);
      });
  }
  //결제목록
  function selectPaymentList() {
    axios
      .post(
        "http://localhost:3000/Muzip/selectPaymentList",
        {
          currentPage: page,
          category: research.category,
          researchinput: research.researchinput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        setPaymentList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //페이지 이동시 목록 다시 받기
  useEffect(() => {
    selectPaymentListCount();
    selectPaymentList();
    console.log(paymentList);
  }, [page]);

  //검색할때마다 목록 다시 받기
  useEffect(() => {
    selectPaymentListCount();
    selectPaymentList();
  }, [research]);
  selectPaymentList();

  return (
    <div>
      <div className="admin_title_area">
        <h3 className="admin_title">결제내역</h3>
      </div>
      <div className="admin_membersearch_area">
        <div className="admin_member_filter">조회된 결제 수: {listcount}</div>
        <div className="admin_membersearch_bar_area">
          <div className="admin_search_filter">
            <select name="category" onChange={handleInputChange}>
              <option value="userId">아이디</option>
              <option value="membershipNo">멤버십 번호</option>
            </select>
          </div>
          <div className="admin_membersearch_bar">
            <input
              type="search"
              placeholder="검색어를 입력해주세요."
              name="researchinput"
              onChange={handleInputChange}
              onKeyDown={handleonKeyDown}
            />
            <button
              className="admin_membersearch_btn"
              onClick={selectListandresearch}
            >
              <HiSearch size={20} id="HiSearch" />
            </button>
          </div>
        </div>
      </div>
      <div className="admin_table_area">
        <table className="admin_tb">
          <thead>
            <tr>
              <td>결제번호</td>
              <td>아이디</td>
              <td>멤버십단계</td>
              <td>결제금액</td>
              <td>결제날짜</td>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((item) => (
              <tr key={item.paymentNo}>
                <td>{item.paymentNo}</td>
                <td>{item.userId}</td>
                {item.membershipNo == 2 && <td>리스너(2)</td>}
                {item.membershipNo == 3 && <td>라이터(3)</td>}
                <td>{item.membershipPrice}원</td>
                <td>{item.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paging page={page} count={listcount} setPage={setPage} />
    </div>
  );
};
