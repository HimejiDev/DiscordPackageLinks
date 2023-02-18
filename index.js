const input = document.getElementById("directory");
const filesContainer = document.getElementsByClassName("filesContainer")[0];
const _status = document.getElementsByClassName("status")[0];

input.onchange = () => {
    _status.innerHTML = 'Status: Checking Messages';
    filesContainer.innerHTML = '';

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

availbleExtentions = ['mp4', 'webm', 'ogg', 'mov', 'png', 'jpg', 'jpeg']
function displayImg(message) {
    const extension = message.split('.').pop().toLowerCase();
    if (availbleExtentions.includes(extension)) {
        let element;
        if (extension === 'mp4' || extension === 'webm' || extension === 'ogg' || extension === 'mov') {
            element = document.createElement('video');
            element.controls = true;
            element.autoplay = false;
            const source = document.createElement('source');
            source.src = message;
            element.appendChild(source);
            element.classList.add('videoFile');
        } else {
            element = document.createElement('img');
            element.src = message;
            element.classList.add('imageFile');
        }

        const displayContainer = document.createElement('div');
        displayContainer.className = 'displayContainer';
        displayContainer.appendChild(element);

        const fileContainer = document.createElement('div');
        fileContainer.appendChild(displayContainer);
        fileContainer.innerHTML += `<a class="link" href="${message}" target="_blank">[LINK] (.${extension})</a>`;
        fileContainer.className = 'fileContainer'
        filesContainer.appendChild(fileContainer);
    }
}

function calculatePro(part, whole) {
    return Math.round((part / whole) * 100);
}