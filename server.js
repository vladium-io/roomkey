import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
    });

    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('client connected');

        socket.on('message', (message) => {
            console.log('incoming message: ', message);
            io.emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('client disconnected');
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> available on http://localhost:3000');
    });
})