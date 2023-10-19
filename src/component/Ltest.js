import LoginModal from "./Login";
import { useAuth } from "./LoginContext";
import MypageBody from "./mypageBody";

export function Ltest() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (user) {
    console.log(user);
    return <MypageBody />;
  }
  console.log(user);
  return <LoginModal />;
}
