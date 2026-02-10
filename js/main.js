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

// [추가] 잡기 시작
function startGrab(e, data) {
    e.preventDefault();
    data.isDragging = true;
    
    const moveEvent = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const nextX = clientX - rect.left - 20;
        const nextY = clientY - rect.top - 20;

        // 이동 거리를 속도(vx, vy)로 변환 (던지는 힘)
        data.vx = (nextX - data.x) * 0.6; 
        data.vy = (nextY - data.y) * 0.6;

        data.x = nextX;
        data.y = nextY;

        data.element.style.left = data.x + 'px';
        data.element.style.top = data.y + 'px';
    };

    const upEvent = () => {
        data.isDragging = false;
        window.removeEventListener('mousemove', moveEvent);
        window.removeEventListener('touchmove', moveEvent);
        window.removeEventListener('mouseup', upEvent);
        window.removeEventListener('touchend', upEvent);
    };

    window.addEventListener('mousemove', moveEvent);
    window.addEventListener('touchmove', moveEvent, {passive: false});
    window.addEventListener('mouseup', upEvent);
    window.addEventListener('touchend', upEvent);
}


// 1. 반짝이 생성 함수 (지속시간 및 크기 수정)
function createSparkle(x, y, isClick = false) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    document.body.appendChild(sparkle);

    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    sparkle.style.left = (x + offsetX - 6) + 'px';
    sparkle.style.top = (y + offsetY - 6) + 'px';

    const size = isClick ? (Math.random() * 12 + 10) : (Math.random() * 8 + 6);
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';

    const spread = isClick ? 80 : 30;
    const destX = (Math.random() - 0.5) * spread; 
    const destY = (Math.random() - 0.5) * spread;

    // [수정] 회전 각도를 줄여서 더 우아하게 (180도 -> 60도~90도)
    const randomRotation = Math.random() * 60 + 30; 

    const animation = sparkle.animate([
        { 
            transform: 'translate(0, 0) scale(0) rotate(0deg)', 
            opacity: 0 
        },
        { 
            transform: 'translate(0, 0) scale(1.1) rotate(20deg)', 
            opacity: 1,
            offset: 0.15 
        },
        { 
            transform: `translate(${destX}px, ${destY}px) scale(0) rotate(${randomRotation}deg)`, 
            opacity: 0 
        }
    ], {
        // [수정] 조금 더 오랫동안 머물도록 시간 설정
        duration: isClick ? 1800 : 1500 + Math.random() * 500, 
        easing: 'ease-out',
        fill: 'forwards'
    });

    animation.onfinish = () => sparkle.remove();
}

// 2. 드래그/마우스 이동 시 (더 많이 생성되도록 확률 조정)
window.addEventListener('mousemove', (e) => {
    // [피드백 반영] 0.7 -> 0.3으로 낮춰서 훨씬 자주 생성 (숫자가 낮을수록 많이 나옴)
    if (Math.random() > 0.2) { 
        createSparkle(e.clientX, e.clientY);
    }
});

window.addEventListener('touchmove', (e) => {
    if (Math.random() > 0.2) {
        createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// 3. 클릭/터치 시 (드래그와 같은 느낌으로 뭉텅이 생성)
const handleBurst = (x, y) => {
    // [피드백 반영] 한 번에 15개 정도 생성해서 풍성하게
    for (let i = 0; i < 15; i++) {
        createSparkle(x, y, true);
    }
};

window.addEventListener('mousedown', (e) => handleBurst(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => {
    handleBurst(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });