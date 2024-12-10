// static/script.js

let timerValue = parseInt(document.getElementById("timer").getAttribute("data-timer"));
const timerDisplay = document.getElementById("timer");
const textEntry = document.getElementById("text-entry");
let countdown;
let initialTimerValue = timerValue;

document.querySelectorAll('.btn-start').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        if (!button.classList.contains('btn-disabled')) {
            initialTimerValue = parseInt(button.getAttribute("name").split('_')[1]);
            document.querySelectorAll('.btn-start').forEach(btn => btn.classList.remove('btn-start-green'));
            button.classList.add('btn-start-green');
            textEntry.removeAttribute('disabled');
            textEntry.focus();  // Set focus to the text area
            disableStartButtons();
            startTimer(initialTimerValue, button);
        }
    });
});

function startTimer(duration, button) {
    clearInterval(countdown);
    timerValue = duration;
    timerDisplay.innerText = timerValue;
    countdown = setInterval(() => {
        if (timerValue > 0) {
            timerValue--;
            timerDisplay.innerText = timerValue;
        } else {
            clearInterval(countdown);
            timerDisplay.innerText = "0";
            textEntry.value = ""; // Clear the text when timer reaches zero
            textEntry.setAttribute('disabled', true); // Disable text entry when timer reaches zero
            button.classList.remove('btn-start-green'); // Revert button color
            enableStartButtons();
        }
    }, 1000);
}

textEntry.addEventListener('input', function() {
    startTimer(initialTimerValue);
});

document.getElementById('clip-it').addEventListener('click', function(event) {
    event.preventDefault();
    navigator.clipboard.writeText(textEntry.value).then(function() {
        // Success callback
        textEntry.value = ''; // Clear the text
        deselectButtons();
        resetTimer(); // Reset timer
        console.log('Text copied to clipboard');
    }).catch(function(error) {
        // Error callback
        console.error('Error copying text to clipboard:', error);
    });
});

document.getElementById('quit').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/shutdown').then(() => {
        window.close();
    });
});

function deselectButtons() {
    let startButtons = document.querySelectorAll('.btn-start');
    startButtons.forEach(btn => {
        btn.classList.remove('btn-start-green');
        btn.classList.remove('btn-disabled');
    });
}

function disableStartButtons() {
    let startButtons = document.querySelectorAll('.btn-start');
    startButtons.forEach(btn => {
        btn.classList.add('btn-disabled');
        btn.disabled = true;
    });
}

function enableStartButtons() {
    let startButtons = document.querySelectorAll('.btn-start');
    startButtons.forEach(btn => {
        btn.classList.remove('btn-disabled');
        btn.disabled = false;
    });
}

function resetTimer() {
    clearInterval(countdown);
    timerValue = 0;
    timerDisplay.innerText = "0";
    textEntry.setAttribute('disabled', true);
    enableStartButtons();
}
