import "../main.css";
import { MyFavHomeFeed } from "../MyFavHomeFeed";
function MypageMyfav(props) {
  const {propsMyItems ,pageUserNo} = props;
  
  return <MyFavHomeFeed propsMyItems={propsMyItems} pageUserNo={pageUserNo}/>
}

export default MypageMyfav;
