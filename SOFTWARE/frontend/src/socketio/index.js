import socketio from 'socket.io-client'

const DNS = 'http://localhost:3333'

const io = socketio.connect(DNS)

io.on('connection', () => {
    console.log('CONNECTED')
} )

// io.on('/status', event => console.log(event))

export default io