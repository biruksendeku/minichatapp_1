const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

const io = require('socket.io')(server);

const port = 8000;
const publicFolder = path.join(__dirname, 'public');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicFolder));

app.get('/', (req, res) => {
	res.render('index');
});

io.on('connection', (socket) => {
	socket.on('user-connection', (name) => {
		socket.broadcast.emit('handle-user-connection', name);
	});
	socket.on('send-message', (data) => {
		socket.broadcast.emit('handle-send-message', data);
	});
	socket.on('user-disconnection', (name) => {
		socket.broadcast.emit('handle-user-disconnection', name);
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});
