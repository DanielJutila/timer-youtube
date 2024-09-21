let userLocale = "en-US",
    newMember = 5;

window.addEventListener("onEventReceived", function (obj) {
    if(!obj.detail.event) return;
    if(typeof obj.detail.event._id !== "undefined"){
        //I added addEvent here and it was not triggered
        const listener = obj.detail.listener;
        console.log(listener);
   
        if(listener === "sponsor-latest"){
            addEvent("red");
        } else {
          
        }
    };

});


function addEvent(color) {
    let widget = document.getElementById("main-container");
    let element = document.createElement('div');
    element.className = 'event';
    element.innerHTML = `<p style='background-color: ${color};'>New Subscriber</p>`;
    widget.appendChild(element);
}

// function addTime(time) {
//     time = time * 60;
    
// }