let Queue = require('queue-fifo');
let queueTCP = new Queue();

module.exports = queueTCP;


// queue.isEmpty();
// // --> true

// queue.enqueue('data item 1');
// queue.enqueue('data item 2');
// queue.enqueue('data item 3');
// queue.enqueue('data item 4');
// // queue contains:
// // 'data item 1', <-- front
// //  ... ,
// // 'data item 4'

// queue.isEmpty();
// // --> false

// queue.size();
// // --> 4

// queue.dequeue();
// // --> removes 'data item 1'

// queue.peek()
// // --> 'data item 2'

// queue.size();
// // --> 3

// queue.clear();
// queue.isEmpty();
// // --> true
