// Set constraints for the video stream
var constraints = {video: {facingMode: "user"}, audio: false};
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.innerHTML = 'Record Video';
        this.timer = null;
        this.className = '';
        return;
    }

    this.innerHTML = 'Stop Recording';
    this.className = 'recording';
    this.timer = setInterval(function () {
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
        // const base64 = cameraOutput.src = cameraSensor.toDataURL("image/png");
        const base64 = cameraSensor.toDataURL("image/png");
        if (!base64) {
            return;
        }
        // cameraOutput.classList.add("taken");
        fetch('/upload64',
            {
                method: 'POST',
                body: JSON.stringify({
                    data: base64
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(console.log)
            .catch(console.error);
    }, 50);      //roughly 20 fps
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);


// Install ServiceWorker
if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('/camera-app/client/sw.js', {scope: ' '}).then(function () {
        console.log('CLIENT: service worker registration complete.');
    }, function () {
        console.log('CLIENT: service worker registration failure.');
    });
} else {
    console.log('CLIENT: service worker is not supported.');
}

