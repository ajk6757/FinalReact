import $ from 'jquery';

$(function(){

    var changing = false;
    window.addEventListener('resize', function(){
        if(!changing && document.body.offsetWidth < 1260){
            changing = true;
            toDot();
            setTimeout( () => toHome1(),200 );
            setTimeout( () => toHome2(),400 );
            setTimeout( () => toHome3(),600 );
            fadeOutAll();
            $("#muzipbar-normal").delay(600).fadeIn(300);
            setTimeout(()=>{changing = false;}, 600);
        };
    });

    // 시작시 다 숨김
    $("#muzipbar-player").hide();
    $("#muzipbar-playList").hide();
    $("#muzipbar-lyrics").hide();
    $("#muzipbar-recommend").hide();
    $("#muzipbar-myPlayListContent").hide();
    $("#muzipbar-addPlayListSong").hide();
    $("#muzipbar-addNewPlayList").hide();
    $("#muzipbar-search").hide();
    $("#muzipbar-outer").css('opacity', '1');

    var home = true;
    const searchInput = $(".searchInput");

    // 클릭시 잠시 사라지게 하는 애니메이션 효과
    function fadeOutAll(){
        $("#muzipbar-normal").fadeOut(100);
        $("#muzipbar-player").fadeOut(30);
        $("#muzipbar-lyrics").fadeOut(100);
        $("#muzipbar-playList").fadeOut(100);
        $("#muzipbar-recommend").fadeOut(100);
        $("#muzipbar-addPlayListSong").fadeOut(100);
        $("#muzipbar-myPlayListContent").fadeOut(100);
        $("#muzipbar-addNewPlayList").fadeOut(100);
        $("#muzipbar-search").fadeOut(100);
    };

    function toDot(){
        $("#muzipbar").css({'width':'3vw','height' : '2.8vw'});
    };

    function toHome1(){
        $("#muzipbar").css({'width':'16vw','height' : '2.8vw', 'background-color' : '#000000', 'border-radius': '1.5vw'});
        home = true;
    };
    function toHome2(){
        $("#muzipbar").css({'width':'13vw','height' : '2.8vw'});
    };
    function toHome3(){
        $("#muzipbar").css({'width':'14vw','height' : '2.8vw'});
    };

    function toPlayer1(){
        $("#muzipbar").css({'width':'16vw','height':'7.2vw', 'background-color' : '#000000e1', 'border-radius': '1vw'});
        $("#volumeBar").hide();
        home = false;
    };
    function toPlayer2(){
        $("#muzipbar").css({'width':'14vw','height':'6vw'});
    };
    function toPlayer3(){
        $("#muzipbar").css({'width':'15vw','height':'6.6vw'});
    };

    function toPlayList1(){
        $("#muzipbar").css({'width':'18vw'});
    };
    function toPlayList2(){
        $("#muzipbar").css({'height':'25vw'});
    };
    function toPlayList3(){
        $("#muzipbar").css({'height':'23vw'});
    };
    function toPlayList4(){
        $("#muzipbar").css({'height':'24vw'});
    };

    function toLyrics1(){
        $("#muzipbar").css({'width':'20vw'});
    };
    function toLyrics2(){
        $("#muzipbar").css({'height':'31vw'});
    };
    function toLyrics3(){
        $("#muzipbar").css({'height':'29vw'});
    };
    function toLyrics4(){
        $("#muzipbar").css({'height':'30vw'});
    };

    function fromListToPlayer1(){
        $("#muzipbar").css({'height':'6.6vw'});
        $("#volumeBar").hide();
    };
    function fromListToPlayer2(){
        $("#muzipbar").css({'width':'14vw'});
    };
    function fromListToPlayer3(){
        $("#muzipbar").css({'width':'16vw'});
    };
    function fromListToPlayer4(){
        $("#muzipbar").css({'width':'15vw'});
    };
    function fromListToPlayerAuto(){
        fromListToPlayer1();
        setTimeout( () => fromListToPlayer2(), 200);
        setTimeout( () => fromListToPlayer3(), 400);
        setTimeout( () => fromListToPlayer4(), 600);
    };

    function changeMenu1(){
        $("#muzipbar").css({'width':'17vw','height':'23vw'});
    };
    function changeMenu2(){
        $("#muzipbar").css({'width':'18.5vw','height':'24.5vw'});
    };
    function changeMenu3(){
        $("#muzipbar").css({'width':'17.5vw','height':'23.5vw'});
    };
    function changeMenu4(){
        $("#muzipbar").css({'width':'18vw','height':'24vw'});
    };
    function changeMenuAuto(){
        changeMenu1();
        setTimeout( () => changeMenu2(),200 );
        setTimeout( () => changeMenu3(),400 );
        setTimeout( () => changeMenu4(),600 );
    };

    function toAddNewPlayList1(){
        $("#muzipbar").css({'height':'17vw'});
    };
    function toAddNewPlayList2(){
        $("#muzipbar").css({'height':'17.5vw'});
    };
    function toAddNewPlayList3(){
        $("#muzipbar").css({'height':'16.5vw'});
    };
    function toAddNewPlayList4(){
        $("#muzipbar").css({'height':'17vw'});
    };

    function completeAddPlayList1(){
        $("#muzipbar").css({'height':'25vw'});
    };
    function completeAddPlayList2(){
        $("#muzipbar").css({'height':'23.5vw'});    
    };
    function completeAddPlayList3(){
        $("#muzipbar").css({'height':'24.5vw'});    
    };
    function completeAddPlayList4(){
        $("#muzipbar").css({'height':'24vw'});    
    };
    
    // 플레이어 바깥을 누르면 기본상태로 되돌아감
    $(document).on("click", "[id='root']>div>div:not([class='최외곽'])", function(){
        if(!home){
            toDot();
            setTimeout( () => toHome1(),200 );
            setTimeout( () => toHome2(),400 );
            setTimeout( () => toHome3(),600 );
            fadeOutAll();
            $("#muzipbar-normal").delay(600).fadeIn(300);
        };
    });
    
    // 기본상태에서 누르면 플레이어로 이동
    $(document).on("click", "[id='muzipbar-normal']", function(){
        if(document.body.offsetWidth >= 1260){
            toDot();
            setTimeout( () => toPlayer1(),200 );
            setTimeout( () => toPlayer2(),400 );
            setTimeout( () => toPlayer3(),600 );
            fadeOutAll();
            $("#muzipbar-player").delay(300).fadeIn(600);
        }else{
            alert("화면의 크기가 작아 플레이어를 열 수 없습니다.");
        }
    });


    // 플레이어에서 내 플레이리스트로 이동
    $(document).on("click", "[class*=myPlayListBtnOuter]", function(){
        toPlayList1();
        setTimeout( () => toPlayList2(),200 );
        setTimeout( () => toPlayList3(),400 );
        setTimeout( () => toPlayList4(),600 );
        fadeOutAll();
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-playList").delay(300).fadeIn(600);
    });

    // 커버 클릭시 현재 재생중인 곡 가사 나옴
    $(document).on("click", "[class*=toLyrics]", function(){
        toLyrics1();
        setTimeout( () => toLyrics2(),200 );
        setTimeout( () => toLyrics3(),400 );
        setTimeout( () => toLyrics4(),600 );
        fadeOutAll();
        $("#muzipbar-lyrics").delay(300).fadeIn(600);
        $("#songInfoContent").delay(301).hide();
    });

    // 앨범 정보 누르면 가사 대신 상세정보 표시
    let songInfoed = false;
    $(document).on("click", "[class*=toSongInfo]", function(){
        if(!songInfoed){
            $(".toSongInfo").fadeOut(200);
            $(".toSongInfo").delay(200).fadeIn(200);
            $("#lyricsContent").fadeOut(200);
            $("#songInfoContent").delay(400).fadeIn(200);
    
            setTimeout( () => {$(".toSongInfo").text("가사");},200);
            songInfoed = true;
        }else{
            $(".toSongInfo").fadeOut(200);
            $(".toSongInfo").delay(200).fadeIn(200);
            $("#songInfoContent").fadeOut(200);
            $("#lyricsContent").delay(400).fadeIn(200);
    
            setTimeout( () => {$(".toSongInfo").text("앨범 정보")},200);
            songInfoed = false;
        }
    });

    // 플레이어로 되돌아가기
    $(document).on("click", "[class*=toPlayer]", function(){
        fromListToPlayer1();
        setTimeout( () => fromListToPlayer2(),200 );
        setTimeout( () => fromListToPlayer3(),400 );
        setTimeout( () => fromListToPlayer4(),600 );
        fadeOutAll();
        $("#muzipbar-player").delay(300).fadeIn(600);
    });

    // 상단 4버튼에서 플리 누르면 내플리로 이동
    $(document).on("click", "[class*=fromListToPlayList]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-playList").delay(300).fadeIn(600);
    });

    // 상단 버튼에서 추천 누르면 추천으로 이동
    $(document).on("click", "[class*=toRecommend]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "장르별 추천 음악");
        $("#muzipbar-recommend").delay(300).fadeIn(600);
        setTimeout(() => {$("#recommendList0").fadeIn();}, 200);
        $("#recommendList1").hide();
        $("#recommendList2").hide();
    });

    // 내플리 목록에서 플리선택하면 해당 플리로 이동
    $(document).on("click", "[class*=toMyPlayListContent]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-myPlayListContent").delay(300).fadeIn(600);
    });
    // 플리 삭제시
    $(document).on("click", "[class*=playlistDelete]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-playList").delay(600).fadeIn(600);
    });

    // 곡 추천 리스트에서 추가누르면 어느 플리에 추가할건지 나옴
    $(document).on("click", "[class*=toAddPlayListSong]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "추가할 플리 선택");
        $("#muzipbar-addPlayListSong").delay(300).fadeIn(600);
    });

    // 곡 추천에서 추천옵션 변경시 input의 값이 바뀜
    $(document).on("change", "input[name=recommendOption]", function(){
        const recommendOption = $("input[name=recommendOption]:checked");
        $("div[id*=recommendList]").fadeOut(100);
        if(recommendOption.val() == "recommend"){
            searchInput.attr("placeholder", "장르별 추천 음악");
            setTimeout(() => {$("#recommendList0").fadeIn();}, 200);
        }else if(recommendOption.val() == "popular"){
            searchInput.attr("placeholder", "오늘의 인기 음악");
            setTimeout(() => {$("#recommendList1").fadeIn();}, 200);
        }else if(recommendOption.val() == "live"){
            searchInput.attr("placeholder", "실시간 인기 음악");
            setTimeout(() => {$("#recommendList2").fadeIn();}, 200);
        }
    });

    // 추천에서 곡추가 누른 후 추가할 플레이리스트 고르면 나옴
    $(document).on("click", "[class*=addMyPlayListSong]", function(){
        changeMenuAuto();
        fadeOutAll();
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-playList").delay(300).fadeIn(600);
    });
    
    // 내 플리에서 플레이리스트추가하기 누르면 나옴
    $(document).on("click", "[class*=toAddNewPlayList]", function(){
        fadeOutAll();
        toAddNewPlayList1();
        setTimeout( () => toAddNewPlayList2(),200 );
        setTimeout( () => toAddNewPlayList3(),400 );
        setTimeout( () => toAddNewPlayList4(),600 );
        searchInput.attr("placeholder", "플레이리스트 추가");
        $("#muzipbar-addNewPlayList").delay(300).fadeIn(600);
    });

    // 플리추가 완료시 다시 내 플리로
    $(document).on("click", "[class*=completeAddPlayList]", function(){
        fadeOutAll();
        completeAddPlayList1();
        setTimeout( () => completeAddPlayList2(),200);
        setTimeout( () => completeAddPlayList3(),400);
        setTimeout( () => completeAddPlayList4(),600);
        searchInput.attr("placeholder", "나의 플레이리스트");
        $("#muzipbar-playList").delay(300).fadeIn(600);
    });
    // 한곡재생
    $(document).on("click", "[class=playMyPlayListSong]", function(){
        fromListToPlayerAuto();
        fadeOutAll();
        $("#muzipbar-player").delay(300).fadeIn(600);
    });
    // 순차재생
    $(document).on("click", "[id=playInOrder]", function(){
        fromListToPlayerAuto();
        fadeOutAll();
        $("#muzipbar-player").delay(300).fadeIn(600);
    });
    // 셔플재생
    $(document).on("click", "[id=playShuffle]", function(){
        fromListToPlayerAuto();
        fadeOutAll();
        $("#muzipbar-player").delay(300).fadeIn(600);
    });
});