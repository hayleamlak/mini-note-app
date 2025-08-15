const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/api/notes') {
        const notes = [
            { id: 1, title: 'Shopping' },
            { id: 2, title: 'Reminder' }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(notes));
    }
});

server.listen(3000, () => console.log('Server running on port 4000'));
