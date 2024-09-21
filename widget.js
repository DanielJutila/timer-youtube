let userLocale = "en-US",
    newMember = 120,
    timerStart = 600,
    currentTimer = 0,
    interval;

// This will reload on refresh, will have to change so it does not reset
window.addEventListener("onWidgetLoad", function (obj) {
    console.log('WIDGET LOAD');
    const fieldData = obj.detail.fieldData;
    console.log(obj.detail.fieldData);
    timerStart = Number(fieldData.timerStart);
    newMember = Number(fieldData.newMember);
    startCountdown();
});

window.addEventListener("onEventReceived", function (obj) {
    if (!obj.detail.event) return;
    

    if (obj.detail.listener === "sponsor-latest") {
       addTime(newMember);

    }
});

function startCountdown() {
    // Clear any existing interval
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(updateCountdown, 1000);
}

function addTime(timeAdded) {
    if (timeAdded > 0) {
        timerStart += timeAdded; 
        if (!interval) {
            startCountdown();
        }
    }
}
function setCurrentTimer(){

}
function updateCountdown() {
    let hours = Math.floor(timerStart / 3600);
    let minutes = Math.floor((timerStart % 3600) / 60);
    let seconds = timerStart % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("countdown").textContent = `${hours}:${minutes}:${seconds}`;

    // Decrement the timer
    if (--timerStart < 0) {
        clearInterval(interval); // Stop the timer when it reaches zero
    }
}