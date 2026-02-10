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
        duration: isClick ? 1800 : 1500 + Math.random() * 700, 
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

window.addEventListener('DOMContentLoaded', () => {
    const cubics = document.querySelectorAll('.floating-cubic');
    const container = document.querySelector('.main-content');
    if (!cubics.length) return;

    const cubicData = [];

    // 1. 초기화
    cubics.forEach((cubic) => {
        const rect = container.getBoundingClientRect();
        const data = {
            element: cubic,
            x: Math.random() * (rect.width - 50),
            y: 150 + Math.random() * 200,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            isDragging: false
        };
        cubicData.push(data);
        
        // [수정] 잡기 이벤트: 함수를 밖으로 빼지 않고 바로 등록
        const startGrab = (e) => {
            e.preventDefault();
            data.isDragging = true;
            data.vx = 0;
            data.vy = 0;

            const moveHandler = (moveEv) => {
                if (!data.isDragging) return;
                const r = container.getBoundingClientRect();
                const cx = moveEv.clientX || (moveEv.touches && moveEv.touches[0].clientX);
                const cy = moveEv.clientY || (moveEv.touches && moveEv.touches[0].clientY);

                // 좌표를 직접 데이터에 꽂아넣기
                data.x = cx - r.left - 25;
                data.y = cy - r.top - 25;
            };

            const upHandler = () => {
                data.isDragging = false;
                // 놓을 때 다시 살짝 움직이게 속도 부여
                data.vx = (Math.random() - 0.5) * 2;
                data.vy = (Math.random() - 0.5) * 2;
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('touchmove', moveHandler);
                window.removeEventListener('mouseup', upHandler);
                window.removeEventListener('touchend', upHandler);
            };

            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('touchmove', moveHandler, { passive: false });
            window.addEventListener('mouseup', upHandler);
            window.addEventListener('touchend', upHandler);
        };

        cubic.addEventListener('mousedown', startGrab);
        cubic.addEventListener('touchstart', startGrab, { passive: false });
    });

    // 2. 애니메이션 루프 (이 부분이 핵심!)
    function render() {
        const rect = container.getBoundingClientRect();
        
        cubicData.forEach(data => {
            if (!data.isDragging) {
                data.x += data.vx;
                data.y += data.vy;

                // 벽 충돌
                if (data.x <= 0 || data.x + 45 >= rect.width) data.vx *= -1;
                if (data.y <= 0 || data.y + 45 >= rect.height) data.vy *= -1;
            }

            // [핵심] 잡고 있든 아니든 무조건 스타일을 실시간 업데이트
            data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
            // 혹시 모르니 left/top 대신 transform을 써보세요. 훨씬 부드럽고 잘 먹힙니다.
            data.element.style.left = '0px'; 
            data.element.style.top = '0px';
        });
        
        requestAnimationFrame(render);
    }
    render();
});