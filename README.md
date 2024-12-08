curl -X POST http://localhost:3000/control-player \
-H "Content-Type: application/json" \
-d '{"action": "pauseVideo"}'


curl -X POST -H "Content-Type: application/json" \
-d '{"youtubeURL": "https://www.youtube.com/watch?v=XeWZIzndlY4"}' \
http://localhost:3000/send-url
{"message":"YouTube URL broadcasted successfully"}



curl -X POST http://localhost:3000/control-player \
-H "Content-Type: application/json" \
-d '{"action": "playVideo"}'


curl -X POST http://localhost:3000/control-player \
-H "Content-Type: application/json" \
-d '{"action": "unMute"}'


curl -X POST http://localhost:3000/control-player \
-H "Content-Type: application/json" \
-d '{"action": "mute"}'




[Unit]
Description=Node.js WebSocket and Express server
After=network.target

[Service]
ExecStart=/usr/bin/node /path/to/your/server.js
WorkingDirectory=/path/to/your/app
Environment=NODE_ENV=production
Restart=always
User=your_user
Group=your_user
# Log output to journal
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target


sudo systemctl daemon-reload

sudo systemctl enable my-node-app


sudo systemctl status my-node-app

sudo journalctl -u my-node-app -f

sudo systemctl stop my-node-app

sudo systemctl restart my-node-app

sudo chown -R your_user:your_user /path/to/your/app
