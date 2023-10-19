import "./App.css";

import Menubar from "./menubar";

import MyFavFeedContent from "./MyFavFeedContent";
import { MoveToTop } from "./MoveToTop";
export function MyFavHomeFeed(props){
    const {propsMyItems, pageUserNo} = props;
    
    

    return (
        <div id="my-home-feed">
            <MyFavFeedContent propsMyItems={propsMyItems} pageUserNo={pageUserNo}/>
        </div>
    )
}