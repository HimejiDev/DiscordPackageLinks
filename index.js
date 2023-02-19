const input = document.getElementById("directory");
const filesContainer = document.getElementsByClassName("filesContainer")[0];
const _status = document.getElementsByClassName("status")[0];
const pageContainer = document.getElementsByClassName('pages')[0];

let files = []
let fileDisplayAmounts = []
let currentPage = 0;
const filesPage = 1000;

input.onchange = () => {
    _status.innerHTML = 'Status: Checking Messages';
    pageContainer.innerHTML = '';

    const worker = new Worker('worker.js');

    worker.postMessage(input.files);

    worker.onmessage = (event) => {
        const messages = event.data;
        const totalFiles = messages.length;

        let totalDone = 0;

        messages.forEach((message, index) => {
            addFile(message);

            totalDone++;

            if (totalDone === totalFiles) {
                _status.innerHTML = `Status: ${calculatePro(totalDone, totalFiles)}% ${totalDone}/${totalFiles} [Done]`;
                
                for (let i = 0; i < Math.floor(files.length/filesPage); i++) {
                    fileDisplayAmounts.push(filesPage);
                    pageContainer.innerHTML += `<div class="page" id="${i+1}">${i+1}</div>`
                }
                if (files.length%filesPage > 0) {
                    fileDisplayAmounts.push(files.length%filesPage);
                    pageContainer.innerHTML += `<div class="page" id="${fileDisplayAmounts.length}">${fileDisplayAmounts.length}</div>`
                }

                const pages = document.getElementsByClassName("page");
                for (let i = 0; i < pages.length; i++) {
                    pages[i].onclick = function () {
                        DisplayPage(pages[i]);
                    };
                }

                DisplayFilesIndex(files, fileDisplayAmounts[currentPage], addInt(fileDisplayAmounts, 0, currentPage-1));
            } else {
                _status.innerHTML = `Status: ${calculatePro(totalDone, totalFiles)}% ${totalDone}/${totalFiles} [loading${totalDone % 4}]`;
            }
        });
    };
};

availbleExtentions = ['mp4', 'webm', 'ogg', 'mov', 'png', 'jpg', 'jpeg']
function addFile(message) {
    const extension = message.split('.').pop().toLowerCase();
    if (availbleExtentions.includes(extension)) {
        files.push(message);
    }
}

function calculatePro(part, whole) {
    return Math.round((part / whole) * 100);
}

function DisplayFilesIndex(array, amount, skip) {
    console.log(amount, skip)
    console.log(fileDisplayAmounts);
    filesContainer.innerHTML = '';
    filesContainer.children = '';
    filesContainer.childNodes = '';
    for (let i = 0; i < amount; i++) {
        const message = array[i + skip];
        const extension = message.split('.').pop().toLowerCase();
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
    _status.innerHTML = `Status: Shown ${amount}/${array.length}`;
}

function DisplayPage(page) {
    console.log(page.attributes.id.nodeValue)
    currentPage = page.attributes.id.nodeValue - 1;
    DisplayFilesIndex(files, fileDisplayAmounts[currentPage], addInt(fileDisplayAmounts, 0, currentPage-1));
}

function addInt(array, start, end) {
    console.log(start, end);
    console.log(end >= 0)
    if (end >= 0) {
        var result = 0;
        for (let i = 0; i < end+1; i++) {
            result += array[i + start];
        }
        return result;
    } else
        return 0;
}