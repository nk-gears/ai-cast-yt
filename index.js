const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000; // Single port for both HTTP and WebSocket

// Middleware for Express
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });

console.log(`Server is running on http://localhost:${port}`);

// Broadcast a YouTube URL to all connected WebSocket clients
function broadcastYouTubeURL(url) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(url);
    }
  });
}


app.post('/control-player', (req, res) => {
    const { action } = req.body;
  
    // Validate action
    const validActions = ['playVideo', 'pauseVideo','unMute','mute'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
  
    console.log(`Sending control action: ${action}`);
  
    // Broadcast the control action to all connected WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'control', action }));
      }
    });
  
    res.json({ message: `Action ${action} sent successfully.` });
  });

  
// Express route to send YouTube URL
app.post('/send-url', (req, res) => {
  const { youtubeURL } = req.body;

  if (!youtubeURL || !isValidYouTubeURL(youtubeURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  console.log(`Broadcasting YouTube URL: ${youtubeURL}`);
  broadcastYouTubeURL(JSON.stringify({ type: 'url', payload:youtubeURL }));

  res.json({ message: 'YouTube URL broadcasted successfully' });
});

// Validate YouTube URL
function isValidYouTubeURL(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regex.test(url);
}

// Handle WebSocket connections
wss.on('connection', ws => {
  console.log('WebSocket client connected.');

  ws.on('message', message => {
    console.log(`Received message from client: ${message}`);
    // Optionally handle messages from WebSocket clients
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
  });
});

// Start the combined HTTP and WebSocket server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});