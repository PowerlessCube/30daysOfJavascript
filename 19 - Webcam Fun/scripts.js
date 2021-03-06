const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia( {video: true, audio: false} )
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error(`Oh no!!!`, err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        
        // mess with them
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;
        // put them back
        ctx.putImageData(pixels, 0, 0);

        console.log(pixels);

    }, 16);
}

function takePhoto() {
    // Played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data our of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.hreef = data;
    link.setAttribute('download', 'handsome');
    link.textContent = `<img src="${data}" alt="Handsome">`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // Blue
    }
    return pixels
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0] + 100 // RED
        pixels.data[i + 500] = pixels.data[i + 1] - 50 // Green
        pixels.data[i - 550] = pixels.data[i + 2] * 0.5 // Blue
    }
    return pixels
}

function greenScreen(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0] + 100 // RED
        pixels.data[i + 500] = pixels.data[i + 1] - 50 // Green
        pixels.data[i - 550] = pixels.data[i + 2] * 0.5 // Blue
    }
    return pixels    
}

getVideo();

video.addEventListener('canplay', paintToCanvas);