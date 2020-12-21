const ytdl = require('ytdl-core');
const ytsearcher = require('ytsearcher');
const auth = require('./auth.json')
const {
    YTSearcher
} = require('ytsearcher');

const searcher = new YTSearcher(auth.apikey);
const play = async (query, connection) => {

    const result = await searcher.search(query, {
        "type": "video"
    });

    const dispatcher = await connection.play(ytdl(JSON.stringify(result.first.url), {
        'type': 'audioonly',
        'quality': 'lowestaudio',
        highWaterMark: 1 << 25
    }));
    return dispatcher.on('start', () => {

        return dispatcher;
    })

}
// Queue class 
class Queue {
    // Array is used to implement a Queue 
    constructor() {
        this.items = [];
    }

    // Functions to be implemented 

    // enqueue(item) 
    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }
    // dequeue() 
    dequeue() {
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    // front() 
    // front function 
    front() {
        // returns the Front element of 
        // the queue without removing it. 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    // isEmpty function 
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }

    // printQueue() 
    // printQueue function 
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + "\n ";
        return str;
    }

}
module.exports.play = play;
module.exports.queue = Queue;