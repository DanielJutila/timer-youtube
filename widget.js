let userLocale = "en-US",
    newMember = 120,
    timerStart = 600;

//This will reload on refresh, Will have to change so it does not reset
window.addEventListener("onWidgetLoad", function (obj) {
    console.log('WIDGET LOAD');
    console.log(obj.detail.fieldData);
    const fieldData = obj.detail.fieldData;
    timerStart = fieldData.timerStart;
    newMember = fieldData.newMember;
    countdownTimer();
});

window.addEventListener("onEventReceived", function (obj) {
    if(!obj.detail.event) return;
    if(typeof obj.detail.event._id !== "undefined"){

        //Listener is event that gets triggered
        const listener = obj.detail.listener;
        if(listener === "sponsor-latest"){
            countdownTimer(newMember);
        } 
    };
});

let interval;
function countdownTimer(timeAdded) {
    console.log(timeAdded);
    if (timeAdded !== undefined && timeAdded > 0) {
        //Added Numer() because it was a string somewhere.
        timerStart = Number(timerStart) + Number(timeAdded);
    }
    // Clear any existing interval
    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(function () {
        let hours = Math.floor(timerStart / 3600);
        let minutes = Math.floor((timerStart % 3600) / 60);
        let seconds = timerStart % 60; 
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById("countdown").textContent = hours + ":" + minutes + ":" + seconds;
        
        // Decrement the timer
        if (--timerStart < 0) {
            clearInterval(interval); // Stop the timer when it reaches zero
        }
       
    }, 1000); // Update every second
}


