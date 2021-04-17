export function truncator (message) {
    const pattern = /ref=/;
    if(message.match(pattern)){
        const messageArray = message.split(' ');
        const arrayToReturn = [];
        for(let word of messageArray) {
            if(word.match(pattern)) {
                word = word.substring(0,word.indexOf('ref'));
            }
            arrayToReturn.push(word);
        }
        return arrayToReturn.join(' ');
    }
}

