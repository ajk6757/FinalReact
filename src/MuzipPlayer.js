import NormalBar from "./component/NormalBar";
import MusicPlayerBar from "./component/MusicPlayerBar";
import PlayListBar from "./component/PlayListBar";
import {Provider, Provider as useSelector} from 'react-redux';
import LyricsBar from "./component/LyricsBar";
import RecommendBar from "./component/RecommendBar";
import MyPlayListContentBar from "./component/myPlayListContentBar";
import AddPlayListSongBar from "./component/AddPlayListSongBar";
import AddNewPlayListBar from "./component/AddNewPlayListBar";
import TempBody from "./component/TempBody";
import store from './store/store';

export default function MuzipPlayer(){
    return(
        <Provider store={store}>
            <div id="muzipbar-outer">
                <div id="muzipbar">
                    <NormalBar/>
                    <MusicPlayerBar/>
                    <LyricsBar/>
                    <PlayListBar/>
                    <RecommendBar/>
                    <MyPlayListContentBar/>
                    <AddPlayListSongBar/>
                    <AddNewPlayListBar/>
                </div>
            </div>
            <TempBody/>
        </Provider>
    )
}