import "./App.css";

import Menubar from "./menubar";

import FeedContent from "./FeedContent";
import { MoveToTop } from "./MoveToTop";
export function HomeFeed(props){
    const {propsItems} = props;
    
    const moveToTop =() => {
        document.getElementById("home-feed").scrollTo({ top: 0, behavior: 'smooth' });  
     }

    return (
        <div id="home-feed">
            <FeedContent propsItems={propsItems}/>
            <MoveToTop moveToTop={moveToTop} />
        </div>
    )
}