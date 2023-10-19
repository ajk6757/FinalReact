import { useState } from "react";
import "./App.css";
import axios from "axios";
import $ from 'jquery';
import { useNavigate } from "react-router";

export const Cloud = () => {

    const [coverFile, setCoverFile] = useState(null);
    const [musicFile, setMusicFile] = useState(null);
    const [title, setTitle] = useState();
    const [artist, setArtist] = useState();
    const [lyrics, setLyrics] = useState();
    const [genre, setGenre] = useState();

    const handleCoverFile = (e) => {
        setCoverFile(e.target.files[0]);
    }
    const handleMusicFile = (e) => {
        setMusicFile(e.target.files[0]);
    }
    const handleTitle = (e) => {
        setTitle(e.target.value);
    }
    const handleArtist = (e) => {
        setArtist(e.target.value);
    }
    const handleGenre = (e) => {
        setGenre(e.target.value);
    }
    const handleLyrics = (e) => {
        setLyrics(e.target.value);
    }
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if(coverFile != null && musicFile != null 
            && title != undefined && title != ""
            && artist != undefined && artist != ""
            && lyrics != undefined && lyrics != ""){
                const formData = new FormData();
                formData.append('cover', coverFile);
                formData.append('music', musicFile);
        
                await axios.post('http://localhost:3000/Muzip/insertMusic', 
                {
                    cover : formData.get('cover'),
                    music : formData.get('music'),
                    title : title,
                    artist : artist,
                    lyrics : lyrics,
                    genre : genre
                } ,{
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                }).then(response => {
                    if(response.data != 0){
                        alert("음원이 등록되었습니다.");
                        document.getElementById("coverImagePreview").src = imageUrl+"img-upload.png";
                        document.getElementById("title").value = "";
                        document.getElementById("artist").value = "";
                        document.getElementById("genre").value = "";
                        document.getElementById("cloudMusicLyrics").value = "";
                        navigate('/cloud');
                    }else{
                        alert("음원 등록에 실패하였습니다.")
                    } 
                }).catch(console.log);
        }else{
            alert("모든 항목을 작성해주세요.");
        }
    }
    const imageUrl = 'http://localhost:8082/Muzip/resources/image/';
    const loadImg = (e) => {
        handleCoverFile(e);
        if(e.target.files.length == 1){
            try {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]); 
                reader.onload = function(ev){
                    if(ev.target.result !== null)
                    document.getElementById("coverImagePreview").src = ev.target.result;
                }
            }catch (error) {
            /// alert(error.message); // 오류 메시지 출력
            $("#errorMsg").click();
            }
        }
    }

    return(
        <div id="home-feed">
            <div id="writeBodyWrap">
                
                <div id="writeHeader"><h4>음원 등록</h4></div>

                <div id="cloudMusicSourceWrap">
                    <div id="WMBW">
                        <label htmlFor="writeMusicSource">
                            <div id="writeMusicBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-file-earmark-music-fill" viewBox="0 0 16 16">
                                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z"/>
                                </svg>음원첨부
                            </div>
                        </label>
                    </div>
                    <input type="file" name="cloudMusicSource" id="writeMusicSource" accept="audio/*" onChange={handleMusicFile}/>
                </div>
               
                <div id="cloudItemTitle">
                    <h3>Cover</h3>
                    <h3>Music</h3>
                </div>

                <div id="cloudMusicInfoWrap">
                    <div id="cloudAlbumCoverWrap">
                        <label htmlFor="cloudAlbumCoverUpdate">
                            <div id="cloudAlbumCover">
                                {
                                    <img id="coverImagePreview" src={imageUrl+"img-upload.png"}/>
                                }
                            </div>
                        </label>
                        <input type="file" name="cloudAlbumCoverUpdate" id="cloudAlbumCoverUpdate" accept="image/*" onChange={loadImg}/>
                    </div>

                    <div id="cloudMusicInfo">
                        <div>
                            <div id="cloudMusicName">
                                <input type="text" id="title" style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}} placeholder="곡명" onChange={handleTitle}/>
                            </div>
                            <div id="cloudArtistName">
                                <input type="text" id="artist" style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}} placeholder="아티스트" onChange={handleArtist}/>
                            </div>
                            <div id="cloudGenreName">
                                <input type="text" id="genre" style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}} placeholder="장르" onChange={handleGenre}/>
                            </div>
                            </div>
                            <div id="cloudMusicLyricsWrap">
                                <textarea id="cloudMusicLyrics" style={sessionStorage.getItem("darkMode") == "Y" ? {color:"white"}:{}} placeholder="가사" onChange={handleLyrics}></textarea>
                            </div>
                        </div>
                    </div>
        
                <div id="writeBtnWrap">
                    <button id="writeBtn" onClick={handleSubmit}>등록</button>
                </div>

            </div>
        </div>
    )
}