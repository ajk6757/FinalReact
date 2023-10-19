import { useParams, Navigate } from "react-router-dom";
import LoginModal from "./Login";
import { useAuth } from "./LoginContext";
import MypageBody from "./component/mypageBody";

// Ltest라는 함수형 컴포넌트를 정의합니다.
export function Ltest(props) {
  // 현재 URL에서 pageUserNo 값을 가져옵니다. 예를 들면, '/user/123' 이면, pageUserNo는 '123'이 됩니다.
  const { pageUserNo } = useParams();
  // 로그인 컨텍스트에서 현재 로그인한 사용자의 정보(user)와 로그아웃 함수(logout)를 가져옵니다.
  const { user, logout } = useAuth();

  // 부모 컴포넌트로부터 받은 props를 해체 할당합니다.
  const { propsMyItems } = props;

  // 사용자가 로그인하지 않은 상태라면 로그인 모달을 표시합니다.
  if (!user) {
    return <LoginModal propsMyItems={propsMyItems}/>;
  }

  // 현재 페이지의 userNo가 없고 로그인된 사용자가 있다면,
  // 로그인된 사용자의 마이페이지로 리다이렉트 합니다.
  if (!pageUserNo && user) {
    return <Navigate to={`/user/${user.userNo}`} />;
  }

  // 페이지 주인 여부를 판단하는 변수입니다. 기본적으로 false로 설정합니다.
  let isPageOwner = false;

  // 로그인된 사용자의 userNo와 URL의 pageUserNo가 동일하다면,
  // 현재 페이지를 보는 사용자가 페이지의 주인임을 나타냅니다.
  if (user.userNo && user.userNo.toString() === pageUserNo) {
    isPageOwner = true;
  }

  // MypageBody 컴포넌트를 리턴하면서, 페이지 주인 여부와 propsMyItems를 함께 전달합니다.
  return <MypageBody isPageOwner={isPageOwner} propsMyItems={propsMyItems} />;
}
