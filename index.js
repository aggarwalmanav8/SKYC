const obj = new HVSelfKyc();
let faceDetection = 'Not started';

const appId = "73dd94";
const userId = "Test3103";

obj.init(appId,userId).then( ret => console.log(ret)).catch(err => console.log(err));

document.getElementById("media-permission").onclick = function() {
    obj.getMediaPermission().then( res => console.log(res)).catch(err => console.log(err));
};

let canvasUpdate = null;

document.getElementById("get-local-stream").onclick = function() {
    obj.getLocalStream().then( (stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        video.height = "240";
        video.width = "320";
        video.playsinline = true;
        video.addEventListener('loadeddata',()=>{
            video.play();
        })
        let element = document.getElementById("space-for-live-video");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        document.getElementById("space-for-live-video").appendChild(video);
    }).catch(err => console.log("error : ",err));
};

document.getElementById("stop-local-stream").onclick = function() {
    if(obj.stopLocalStream()){
        let element = document.getElementById("space-for-live-video");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        clearInterval(canvasUpdate);
    }else {
        document.getElementById("output-field").value = "Can't stop local stream";
    }
};

document.getElementById("capture-image-1").onclick = function() {
    obj.captureImage('selfie1', 'selfie').then(({ image, livenessResult, livenessError }) => {
          document.getElementById('selfie1').src = image;
          console.log("livenessResults : ",livenessResult);
          console.log("livenessError : ",livenessError);
          if (livenessError) {
              throw livenessError;
          }
          document.getElementById("output-field").value = JSON.stringify(livenessResult);
    }).catch(err => console.log("Error occured during image capture : ",err));
};

document.getElementById("capture-image-2").onclick = function() {
  console.log("Cature Clicked")
    obj.captureImage('selfie2','selfie',
    { withLivenessCheck: true,
        withPlainBackgroundCheck: true,
        save: true,
        docFacingMode: true
      }).then(({ image, livenessResult, qualityCheckError, livenessError }) => {
        document.getElementById('selfie2').src = image;
        console.log("livenessResults : ",livenessResult);
        console.log("qualityCheckError : ",qualityCheckError);
        console.log("livenessError : ",livenessError);
        if (livenessError) {
            throw livenessError;
        }
        document.getElementById("output-field").value = JSON.stringify(livenessResult);
    }).catch(err => console.log("Error occured during image capture : ",err));
};

document.getElementById("face-match").onclick = function() {
    obj.faceMatch('selfie','selfie1').then( res => {
        console.log(res);
        document.getElementById("output-field").value = JSON.stringify(res);
    }).catch(err => {
        console.log(err);
        document.getElementById("output-field").value = JSON.stringify(err);

    });
};

document.getElementById("liveness-check").onclick = function() {
    obj.checkLiveness('selfie1').then( res => {
        document.getElementById("output-field").value = JSON.stringify(res);
    }).catch(err => console.log(err));
};

document.getElementById("start-recording").onclick = function() {
    obj.startRecording().then( res => {
        document.getElementById("output-field").value = "STARTED";
    }).catch( err => {
        console.log(err);
        document.getElementById("output-field").value = JSON.stringify(err);
    })
}

document.getElementById("stop-recording").onclick = function() {
    if(obj.stopRecording())
    {
        document.getElementById("output-field").value = "STOPPED";
    }else{
        document.getElementById("output-field").value = "Can't stop";
    }
}

document.getElementById("preview-recording").onclick = function() {
    const blob = obj.previewRecording();
    if(blob){
        const txt = window.URL.createObjectURL(blob);
        const video = document.createElement('video');
        video.src = txt;
        video.muted = false;
        video.height = "240";
        video.width = "320";

        video.controls = true;
        video.playsinline = true;
        video.addEventListener('loadeddata',()=>{

            video.play();
        })
        let element = document.getElementById("space-for-preview");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        document.getElementById("space-for-preview").appendChild(video);
    }
    else
        document.getElementById("output-field").value = "Fail";
};

document.getElementById("upload-recording").onclick = function() {
    obj.uploadRecording({
      videoFormat: "video/webm"
    }).then(res => console.log(res)).catch(err => console.log(err));
    console.log(obj);
};

const success = () =>{
    if (faceDetection !== 'In the frame'){
        faceDetection = 'In the frame';
        document.getElementById('face-detection-result').innerHTML = faceDetection;
    }
}
const fail = (error) => {
    if (error.code === 'MultipleFacesDetectedError' && faceDetection !== 'Multiple faces') {
        faceDetection = 'Multiple faces';
    } else if (error.code === 'NoFaceDetectedError' && faceDetection !== 'Out of frame') {
        faceDetection = 'Out of frame';
    }
    document.getElementById('face-detection-result').innerHTML = faceDetection;
}

document.getElementById("start-face-detection").onclick = function() {
    obj.startFaceDetection(success,fail).then( ret => console.log("started : ",ret)).catch(err => console.log(err));
}

document.getElementById("stop-face-detection").onclick = function() {
    obj.stopFaceDetection();
    document.getElementById('face-detection-result').innerHTML = 'NOT STARTED';
}
