import "./App.css";

import Menubar from "./menubar";

import MyFeedContent from "./MyFeedContent";
import { MoveToTop } from "./MoveToTop";
export function MyHomeFeed(props){
    const {propsMyItems,pageUserNo,subItems} = props;
    
    

    return (
        <div id="my-home-feed">
            <MyFeedContent propsMyItems={propsMyItems} pageUserNo={pageUserNo} subItems={subItems}/>
        
        </div>
    )
}