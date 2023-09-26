const suggestion = document.querySelector('.suggestion');
const main = document.querySelector('.main');

suggestion.addEventListener('animationend', () => {
    const startButton = createElement('button', 'btn', `<span>Старт</span>`);
    startButton.addEventListener('click', play);
    const bg = createElement('img', 'bg', null, 'assets/images/dino_00.png');
    main.append(startButton);
    main.append(bg);
    setTimeout(() => {
        startButton.classList.add('btn--visible');
        startButton.focus();
        startButton.addEventListener('transitionend', () => {
            bg.classList.add('bg--visible');
        }, false);
    }, 0);

}, false)

function createElement(tag, className, innerStr = null, src = null) {
    const element = document.createElement(tag);
    element.classList.add(className);

    if (innerStr) {
        element.innerHTML = innerStr;
    }

    if (src) {
        element.src = src;
    }

    return element;
}

function play() {
    main.innerHTML = '';
    const content = `<div id='dino'><div class='dino-image'></div></div><div id='cactus'></div><div id='babysitter'></div><div class='ground'></div>`;
    const gameContainer = createElement('div', 'play', content, false);
    main.append(gameContainer);

    const dino = document.getElementById('dino');
    const dinoImage = document.querySelector('.dino-image');
    const cactus = document.getElementById('cactus');
    const babysitter = document.getElementById('babysitter');

    document.addEventListener('keydown', jump);

    function jump() {
        if (!dino.classList.contains('jump')){
            dino.classList.add('jump');
            dino.addEventListener('animationend', () => {
                dino.classList.remove('jump')
            }, false);
        }
    }

    const alive = setInterval (() => {
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        const babysitterRect = babysitter.getBoundingClientRect();
        const isGameOver = (
            areRangesOverlap(
                [dinoRect.left + (dinoRect.width / 5), dinoRect.right - (dinoRect.width / 5 * 2)],
                [cactusRect.left, cactusRect.right]) &&
            dinoRect.bottom > cactusRect.top
        );
        const isWin = (
            areRangesOverlap(
                [dinoRect.left + (dinoRect.width / 5), dinoRect.right - (dinoRect.width / 5)],
                [babysitterRect.left, babysitterRect.right]) &&
            babysitterRect.bottom > dinoRect.top
        );

        const finish = (text) => {
            dino.classList.add('paused');
            dinoImage.classList.add('paused');
            cactus.classList.add('paused');
            babysitter.classList.add('paused');
            clearInterval(alive);
            const result = createElement('div', 'result', text);
            gameContainer.append(result);
        }

        const createBtn = (text) => {
            const btn = createElement('button', 'btn', text);
            btn.classList.add('button', 'btn--visible');
            gameContainer.append(btn);
            btn.focus();
            btn.addEventListener('click', play);
        }

        if (isGameOver) {
            finish('Еще есть шанс');
            createBtn('Играть');

        } else if (isWin) {
            finish('Няня всегда рядом!');
            const text = `<div class='before'></div><div class='after'></div>`
            const pyro = createElement('div', 'pyro', text);
            gameContainer.append(pyro)
            setTimeout(() => {
                createBtn('Играть');
            },2000)
        }
    }, 10)
}

function areRangesOverlap (range1, range2) {
    return isPointInRange(range1[0], range2) || isPointInRange(range1[1], range2) || isPointInRange(range2[0], range1) || isPointInRange(range2[1], range1);
}

function isPointInRange (point, range) {
    return point >= range[0] && point <= range[1];
}
