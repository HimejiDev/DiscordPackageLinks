self.onmessage = (event) => {
    const files = event.data;

    const messages = [];

    for (const file of files) {
        if (file.type === 'application/vnd.ms-excel' && file.webkitRelativePath.includes('messages')) {
            const reader = new FileReaderSync();
            const text = reader.readAsText(file);
            const rows = text.split('\n');
            const data = rows.map(row => row.split(','));

            data.forEach(messageArray => {
                messageArray.forEach(message => {
                    if (message.includes('cdn.discordapp.com')) {
                        message.split(' ').forEach(link => {
                            messages.push(link);
                        })
                    }
                });
            });
        }
    }

    self.postMessage(messages);
};
