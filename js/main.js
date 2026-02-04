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
        btnImg.src = 'asset/images/music_off.png'; 
        isPlaying = true;
        console.log("노래 시작");
    } else {
        player.pauseVideo();
        btnImg.src = 'asset/images/music_on.png';
        isPlaying = false;
        console.log("노래 일시정지");
    }
}

// 큐빅 데이터 초기화
const cubics = document.querySelectorAll('.floating-cubic');
const container = document.querySelector('.main-content');
const containerRect = container.getBoundingClientRect();

const cubicData = [];

cubics.forEach((cubic) => {
    // 1. 초기 위치를 귀 주변(중앙)으로 랜덤 배치
    const startX = Math.random() * (containerRect.width - 40);
    const startY = 140 + Math.random() * 300; // 귀 위치(top 140) 근처에서 시작

    const data = {
        element: cubic,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        isDragging: false
    };
    cubicData.push(data);
});

// 애니메이션 루프 (통통 튀기)
function animate() {
    const rect = container.getBoundingClientRect();
    
    cubicData.forEach(data => {
        if (!data.isDragging) {
            data.x += data.vx;
            data.y += data.vy;

            // 벽에 부딪히면 튕기기
            if (data.x <= 0 || data.x + 35 >= rect.width) data.vx *= -1;
            if (data.y <= 0 || data.y + 35 >= rect.height) data.vy *= -1;

            data.element.style.left = data.x + 'px';
            data.element.style.top = data.y + 'px';
        }
    });
    requestAnimationFrame(animate);
}

animate();