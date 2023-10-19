import { MyHomeFeed } from "../MyHomeFeed";
import "../main.css";

function Myfeed(props) {
  const {propsMyItems,pageUserNo} = props;
  return <MyHomeFeed propsMyItems={propsMyItems} pageUserNo={pageUserNo}/>
}

export default Myfeed;
