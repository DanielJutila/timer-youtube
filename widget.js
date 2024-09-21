let userLocale = "en-US",
    // should be 5 minutes by default
    newSubscriber = 5,
    newMember = 5,
    minDonation = 1.0,
    newDonation = 5;

window.addEventListener("onEventReceived", function (obj) {
    if(!obj.detail.event) return;
    if(typeof obj.detail.event.itemId !== "undefined"){

        const listener = obj.detail.listener.split("-"[0]);
        const event = obj.detail.event;
        let widget = document.getElementById("main-container");
        if(listener === "sponsor-latest"){
            widget.innerHTML = `<h1>Recent member</h1><p>HELLO</p>`;
        }
    };

});


// function addTime(time) {
//     time = time * 60;
    
// }