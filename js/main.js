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
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        isDragging: false
    };
    cubicData.push(data);
    // [추가] 마우스와 터치 시작 이벤트 연결
cubic.addEventListener('mousedown', (e) => startGrab(e, data));
cubic.addEventListener('touchstart', (e) => startGrab(e, data), {passive: false});
});

// 애니메이션 루프 (통통 튀기)
function animate() {
    const rect = container.getBoundingClientRect();
    
    cubicData.forEach(data => {
        if (!data.isDragging) {
            data.x += data.vx;
            data.y += data.vy;
            data.vx *= 0.98; // [선택 추가] 공기 저항

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
function startGrab(e, data) {
    e.preventDefault();
    data.isDragging = true;
    
    // 잡는 순간 속도를 0으로 만들어서 멈추게 함
    data.vx = 0;
    data.vy = 0;

    // 이벤트에서 좌표 추출하는 헬퍼 함수
    const getPoint = (ev) => {
        if (ev.touches && ev.touches.length > 0) {
            return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
        }
        return { x: ev.clientX, y: ev.clientY };
    };

    const onMove = (moveEv) => {
        if (!data.isDragging) return;

        const rect = container.getBoundingClientRect();
        const pt = getPoint(moveEv);

        // 큐빅의 중심이 마우스/손가락을 따라오도록 계산
        const nextX = pt.x - rect.left - 20; 
        const nextY = pt.y - rect.top - 20;

        // 던지는 힘 계산 (새 위치 - 이전 위치)
        data.vx = (nextX - data.x) * 0.7; 
        data.vy = (nextY - data.y) * 0.7;

        data.x = nextX;
        data.y = nextY;

        // 화면 밖으로 나가지 않게 방지
        data.x = Math.max(0, Math.min(rect.width - 35, data.x));
        data.y = Math.max(0, Math.min(rect.height - 35, data.y));

        data.element.style.left = data.x + 'px';
        data.element.style.top = data.y + 'px';
    };

    const onUp = () => {
        data.isDragging = false;
        // 등록했던 윈도우 이벤트들 제거
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
    };

    // 윈도우 전체에 이벤트를 걸어야 마우스를 빨리 움직여도 안 놓쳐요!
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
}