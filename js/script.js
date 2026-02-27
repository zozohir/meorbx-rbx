const FALLBACK_IMAGE = 'https://www2.0zz0.com/2025/09/30/19/744312150.png';

const phase0 = document.getElementById('phase0');
const phase1 = document.getElementById('phase1');
const phase2 = document.getElementById('phase2');
const phase2_5 = document.getElementById('phase2_5');
const phase3 = document.getElementById('phase3');
const phase4 = document.getElementById('phase4');
const userInput = document.getElementById('userInput');
const lookupBtn = document.getElementById('lookupBtn');
const lookupBtnText = document.getElementById('lookupBtnText');
const alertBox = document.getElementById('alertBox');
const alertContent = document.getElementById('alertContent');
const successFoundCard = document.getElementById('successFoundCard');
const successUsername = document.getElementById('successUsername');
const messageWrapper = document.getElementById('messageWrapper');
const paymentChoices = document.querySelectorAll('.payment-choice');

const userShow = document.getElementById('userShow');
const userShow2 = document.getElementById('userShow2');
const userShow3 = document.getElementById('userShow3');
const taskBar = document.getElementById('taskBar');
const taskPercent = document.getElementById('taskPercent');
const taskLogs = document.getElementById('taskLogs');
const coinSelectors = document.querySelectorAll('.coin-selector');
const gemChoices = document.querySelectorAll('.gem-choice');
const claimBtn = document.getElementById('claimBtn');
const checkSection = document.getElementById('checkSection');
const doneSection = document.getElementById('doneSection');
const timer = document.getElementById('timer');

const rewardIconBox = document.getElementById('rewardIconBox');
const rewardNumber = document.getElementById('rewardNumber');
const rewardType = document.getElementById('rewardType');

let pickedCoin = 0;
let pickedGem = 0;
let pickedPayment = '';
let savedUsername = '';

let coinTotal = 8547;
let gemTotal = 6923;
let updateRound = 0;

// ── Animate stock bars on page load ─────────────────────────────────
function animateStockBars() {
    document.querySelectorAll('.stock-bar-fill[data-fill]').forEach((bar, i) => {
        setTimeout(() => {
            bar.style.width = bar.dataset.fill + '%';
        }, 500 + i * 150);
    });
}

// Decrease stock percentages randomly to create urgency
function decreaseStock() {
    const stockCounts = document.querySelectorAll('.stock-count');
    stockCounts.forEach(el => {
        const match = el.textContent.match(/(\d+)%/);
        if (match) {
            let num = parseInt(match[1]);
            if (num > 5 && Math.random() < 0.4) {
                num += 1;
                if (num > 99) num = 99;
                el.textContent = num + '%';
                const wrapper = el.closest('.stock-wrapper');
                if (wrapper) {
                    const bar = wrapper.querySelector('.stock-bar-fill');
                    if (bar) bar.style.width = num + '%';
                }
            }
        }
    });
}

setInterval(decreaseStock, 7000);
setTimeout(animateStockBars, 300);
// ────────────────────────────────────────────────────────────────────

function refreshMetrics() {
    const coinAdd = Math.floor(Math.random() * 100) + 500;
    const gemAdd = Math.floor(Math.random() * 100) + 500;
    coinTotal += coinAdd;
    gemTotal += gemAdd;
    countUp('coinUsers', coinTotal);
    countUp('gemUsers', gemTotal);
    updateRound++;
    if (updateRound === 1) setTimeout(refreshMetrics, 2000);
    else if (updateRound === 2) setTimeout(refreshMetrics, 2000);
    else setTimeout(refreshMetrics, 4000);
}

function countUp(elemId, final) {
    const elem = document.getElementById(elemId);
    const start = parseInt(elem.textContent.replace(/,/g, ''));
    const step = Math.ceil((final - start) / 20);
    let current = start;
    const interval = setInterval(() => {
        current += step;
        if (current >= final) {
            current = final;
            clearInterval(interval);
            elem.parentElement.style.transform = 'scale(1.1)';
            setTimeout(() => { elem.parentElement.style.transform = 'scale(1)'; }, 200);
        }
        elem.textContent = current.toLocaleString();
    }, 50);
}

setTimeout(refreshMetrics, 2000);

function scrollSmooth(elem, adjust = -20) {
    setTimeout(() => {
        const pos = elem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: pos + adjust, behavior: 'smooth' });
    }, 300);
}

const playerNames = [
    'Alex_Pro', 'Sarah_Gaming', 'Mike_Player', 'Emma_2024', 'John_RBX',
    'Lisa_Cool', 'Tom_Legend', 'Anna_Star', 'Chris_Pro', 'Mia_Queen',
    'Ryan_King', 'Sophia_Gamer', 'Noah_Elite', 'Olivia_Best', 'Lucas_Hero',
    'Ava_Master', 'Ethan_Boss', 'Isabella_VIP', 'Mason_Prime', 'Charlotte_Pro'
];
const coinValues = [800, 1200, 2500, 5000, 10000, 15000, 25000];
const gemValues  = [100, 250, 500, 700, 900, 1500];

function popMessage() {
    const player = playerNames[Math.floor(Math.random() * playerNames.length)];
    const coins  = coinValues[Math.floor(Math.random() * coinValues.length)];
    const gems   = gemValues[Math.floor(Math.random() * gemValues.length)];
    const msg = document.createElement('div');
    msg.className = 'alert-message';
    msg.innerHTML = `
        <img src="${FALLBACK_IMAGE}" alt="User" class="message-photo">
        <div class="message-body">
            <div class="message-name">${player}</div>
            <div class="message-text">
                <i class="fas fa-check-circle message-symbol"></i>
                <span>Received ${coins.toLocaleString()} Robux + ${gems} Diamonds</span>
            </div>
        </div>`;
    messageWrapper.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
}

setInterval(popMessage, 5000);
setTimeout(popMessage, 1000);

paymentChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        paymentChoices.forEach(c => c.classList.remove('picked'));
        choice.classList.add('picked');
        pickedPayment = choice.dataset.type;
        setTimeout(() => {
            phase0.classList.add('hidden');
            phase1.classList.remove('hidden');
            scrollSmooth(phase1, -80);
            setTimeout(() => {
                document.querySelectorAll('#phase2 .stock-bar-fill[data-fill], #phase2_5 .stock-bar-fill[data-fill]').forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.fill + '%'; }, i * 200);
                });
            }, 200);
        }, 500);
    });
});

// ── SEARCH ──────────────────────────────────────────────────────────
function doSearch() {
    const player = userInput.value.trim();

    if (player === '') {
        userInput.classList.add('vibrate', 'border-red-500');
        setTimeout(() => {
            userInput.classList.remove('vibrate');
            setTimeout(() => userInput.classList.remove('border-red-500'), 500);
        }, 500);
        return;
    }

    alertBox.style.display = 'none';
    lookupBtn.disabled = true;
    lookupBtnText.innerHTML = '<span class="loader-circle"></span> SEARCHING...';

    setTimeout(() => {
        lookupBtn.disabled = false;
        lookupBtnText.innerHTML = 'SEARCH USER';

        savedUsername = player;
        userShow.textContent  = player;
        userShow2.textContent = player;
        userShow3.textContent = player;

        successUsername.textContent = player;
        successFoundCard.classList.remove('visible');
        void successFoundCard.offsetWidth;
        successFoundCard.classList.add('visible');
        scrollSmooth(successFoundCard, -50);

        setTimeout(() => {
            phase1.classList.add('hidden');
            successFoundCard.classList.remove('visible');

            if (pickedPayment === 'robux') {
                phase2.classList.remove('hidden');
                scrollSmooth(phase2, -80);
                setTimeout(() => {
                    document.querySelectorAll('#phase2 .stock-bar-fill[data-fill]').forEach((bar, i) => {
                        setTimeout(() => { bar.style.width = bar.dataset.fill + '%'; }, i * 200);
                    });
                }, 400);
            } else {
                phase2_5.classList.remove('hidden');
                scrollSmooth(phase2_5, -80);
                setTimeout(() => {
                    document.querySelectorAll('#phase2_5 .stock-bar-fill[data-fill]').forEach((bar, i) => {
                        setTimeout(() => { bar.style.width = bar.dataset.fill + '%'; }, i * 200);
                    });
                }, 400);
            }
        }, 2200);

    }, 1500);
}

lookupBtn.addEventListener('click', doSearch);
userInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

coinSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
        coinSelectors.forEach(s => s.classList.remove('border-accent-emerald'));
        selector.classList.add('border-accent-emerald');
        selector.style.transform = 'scale(0.95)';
        setTimeout(() => {
            selector.style.transform = 'scale(1.05)';
            setTimeout(() => { selector.style.transform = 'scale(1)'; }, 150);
        }, 150);
        pickedCoin = selector.dataset.amount;
        pickedGem = 0;
        setTimeout(() => {
            phase2.classList.add('hidden');
            phase3.classList.remove('hidden');
            scrollSmooth(phase3, -80);
            runProgress();
        }, 500);
    });
});

gemChoices.forEach(gem => {
    gem.addEventListener('click', () => {
        gemChoices.forEach(g => g.classList.remove('picked'));
        gem.classList.add('picked');
        gem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            gem.style.transform = 'scale(1.05)';
            setTimeout(() => { gem.style.transform = 'scale(1)'; }, 150);
        }, 150);
        pickedGem = gem.dataset.amount;
        pickedCoin = 0;
        setTimeout(() => {
            phase2_5.classList.add('hidden');
            phase3.classList.remove('hidden');
            scrollSmooth(phase3, -80);
            runProgress();
        }, 500);
    });
});

function animateReward(target) {
    let value = 0;
    const time = 10000;
    const add = target / (time / 50);
    const loop = setInterval(() => {
        value += add;
        if (value >= target) {
            value = target;
            clearInterval(loop);
        }
        rewardNumber.textContent = Math.floor(value).toLocaleString();
    }, 50);
}

function runProgress() {
    if (pickedPayment === 'robux') {
        rewardIconBox.innerHTML = '<div class="coin-symbol reward-symbol"></div>';
        rewardType.textContent = 'ROBUX';
        animateReward(parseInt(pickedCoin));
    } else if (pickedPayment === 'diamond') {
        rewardIconBox.innerHTML = '<img src="images/901289026.png" alt="Diamond" class="reward-symbol">';
        rewardType.textContent = 'DIAMONDS';
        animateReward(parseInt(pickedGem));
    }

    let prog = 0;
    const tick = setInterval(() => {
        prog += 1;
        taskBar.style.width = `${prog}%`;
        taskPercent.textContent = `${prog}%`;

        if (prog === 10) { logTask('Searching database...'); }
        else if (prog === 30) { logTask('Account found!'); }
        else if (prog === 45) { logTask(`User confirmed`); }
        else if (prog === 60) {
            if (pickedPayment === 'robux') { logTask(`Generating ${pickedCoin} Robux...`); }
            else { logTask(`Generating ${pickedGem} Diamonds...`); }
        }
        else if (prog === 75) { logTask('Encrypting data...'); }
        else if (prog === 90) { logTask('Preparing final verification...'); }
        else if (prog === 99) { logTask('All rewards ready! Finalizing...'); }

        if (prog >= 100) {
            clearInterval(tick);
            setTimeout(() => {
                const prizeShow = document.getElementById('prizeShow');
                const completePrize = document.getElementById('completePrize');
                const levitateIcon = document.getElementById('levitateIcon');

                if (pickedPayment === 'robux') {
                    levitateIcon.innerHTML = `<div class="coin-symbol" style="width: 60px; height: 60px;"></div>`;
                    prizeShow.innerHTML = `<span class="font-bold text-xl">${pickedCoin.toLocaleString()}</span> Robux are ready!`;
                    completePrize.innerHTML = `
                        <div class="coin-symbol" style="width: 28px; height: 28px;"></div>
                        <span class="font-bold text-xl ml-2">${pickedCoin.toLocaleString()}</span>
                    `;
                } else if (pickedPayment === 'diamond') {
                    levitateIcon.innerHTML = `<img src="images/901289026.png" alt="Diamond" style="width: 60px; height: 60px;">`;
                    prizeShow.innerHTML = `<span class="font-bold text-xl">${pickedGem.toLocaleString()}</span> Diamonds are ready!`;
                    completePrize.innerHTML = `
                        <i class="fas fa-gem text-xl mr-2" style="color: #60a5fa;"></i>
                        <span class="font-bold text-xl">${pickedGem.toLocaleString()}</span>
                    `;
                }

                phase3.classList.add('hidden');
                phase4.classList.remove('hidden');
                scrollSmooth(phase4, -80);
            }, 1000);
        }
    }, 100);
}

function logTask(text) {
    const log = document.createElement('div');
    log.className = 'mb-1';
    log.innerHTML = `<i class="fas fa-check-circle text-green-500 mr-2"></i> ${text}`;
    taskLogs.appendChild(log);
    taskLogs.scrollTop = taskLogs.scrollHeight;
}

claimBtn.addEventListener('click', () => {
    checkSection.classList.add('hidden');
    doneSection.classList.remove('hidden');
    scrollSmooth(doneSection, -50);

    let mins = 5;
    let secs = 0;
    const countdown = setInterval(() => {
        if (secs === 0) {
            if (mins === 0) { clearInterval(countdown); return; }
            mins--;
            secs = 59;
        } else {
            secs--;
        }
        let showMins = mins < 10 ? '0' + mins : mins;
        let showSecs = secs < 10 ? '0' + secs : secs;
        timer.textContent = `${showMins}:${showSecs}`;
    }, 1000);
});