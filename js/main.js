window.addEventListener('load', function() {
    const intro = document.querySelector('.intro');
    
    if (intro) {
        setTimeout(() => {
            intro.classList.add('finished');
            console.log("중앙에서부터 화면이 열립니다.");
        }, 3000); // 3초 대기
    }
});

let player;
let isPlaying = false;

// 1. 유튜브 API가 로드되면 자동으로 실행됨
function onYouTubeIframeAPIReady() {
    console.log("유튜브 API 로드 중...");
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'FK_M7s4Rt7M', // 님 노래 ID
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': 'FK_M7s4Rt7M'
        },
        events: {
            'onReady': function() {
                console.log("음악 준비 완료! 버튼을 누르세요.");
            },
            'onError': function(e) {
                console.error("유튜브 오류 발생: ", e);
            }
        }
    });
}

// 2. 버튼 클릭 함수
function toggleMusic() {
    const btnImg = document.getElementById('music-btn');
    
    if (!player || typeof player.playVideo !== 'function') {
        alert("아직 음악이 로딩 중입니다. 잠시만 기다려주세요!");
        return;
    }

    if (!isPlaying) {
        player.playVideo();
        btnImg.src = 'asset/images/music_off.png'; // 언더바 확인!
        isPlaying = true;
        console.log("노래 시작!");
    } else {
        player.pauseVideo();
        btnImg.src = 'asset/images/music_on.png'; // 언더바 확인!
        isPlaying = false;
        console.log("노래 일시정지!");
    }
}

