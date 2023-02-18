const input = document.getElementById("directory");
const images = document.getElementsByClassName("images")[0];
const _status = document.getElementsByClassName("status")[0];

input.onchange = () => {
    _status.innerHTML = 'Status: Checking Messages';
    images.innerHTML = '';

    const worker = new Worker('worker.js');

    worker.postMessage(input.files);

    worker.onmessage = (event) => {
        const messages = event.data;
        const totalFiles = messages.length;

        let totalDone = 0;

        messages.forEach((message, index) => {
            setTimeout(() => {
                displayImg(message);

                totalDone++;

                if (totalDone === totalFiles) {
                    _status.innerHTML = `Status: ${calculatePro(totalDone, totalFiles)} ${totalDone}/${totalFiles}`;
                } else {
                    _status.innerHTML = `Status: ${calculatePro(totalDone, totalFiles)}% ${totalDone}/${totalFiles} (loading...)`;
                }
            }, index * 10);
        });
    };
};

function displayImg(message) {
    // const img = document.createElement('img');
    // img.src = message;
    // img.classList.add('imgP');
    // img.onerror = function() {
    //     // handle the error here
    //     console.log('Failed to load image:', message);
    // };
    // const div = document.createElement('div');
    // div.className = 'img';
    // div.appendChild(img);
    // div.innerHTML += `<br><a href="${message}" target="_blank">[LINK] (${message.split('.').pop()})</a>`;
    // images.appendChild(div);
    const extension = message.split('.').pop().toLowerCase();
    let element;
    if (extension === 'mp4' || extension === 'webm' || extension === 'ogg' || extension === 'mov') {
        element = document.createElement('video');
        element.controls = true;
        element.autoplay = false;
        const source = document.createElement('source');
        source.src = message;
        element.appendChild(source);
    } else {
        element = document.createElement('img');
        element.src = message;
    }
    element.classList.add('imgP');
    const div = document.createElement('div');
    div.className = 'img';
    div.appendChild(element);
    div.innerHTML += `<br><a href="${message}" target="_blank">[LINK] (${extension})</a>`;
    images.appendChild(div);
}

function calculatePro(part, whole) {
    return Math.round((part / whole) * 100);
}