(function () {
    const websocketURL = `ws://${location.hostname}:3000`;
    const playerIframe = document.getElementById('player');
    let isYouTubePlayerReady = false;
  
    // Listen for YouTube IFrame API ready events
    window.onYouTubeIframeAPIReady = () => {
      isYouTubePlayerReady = true;
    };
  
    // Initialize WebSocket
    const socket = new WebSocket(websocketURL);
  
    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'url') {
          const videoID = extractVideoID(data.payload);
          if (videoID) {
            // Remove mute=1 to allow volume control on iOS
            playerIframe.src = `https://www.youtube.com/embed/${videoID}?enablejsapi=1&autoplay=1`;
            if (!isYouTubePlayerReady) {
              loadYouTubeAPI();
            }
          } else {
            console.error('Invalid YouTube URL received.');
          }
        } else if (data.type === 'control') {
          // Control player (play/pause/mute/unmute)
          window.controlPlayer(data.action);
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    // Extract YouTube video ID from the URL
    function extractVideoID(url) {
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  
    // Load YouTube IFrame Player API script
    function loadYouTubeAPI() {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  
    // API to control the player (play/pause/mute/unmute)
    window.controlPlayer = (action) => {
      if (!isYouTubePlayerReady || !playerIframe.contentWindow) {
        console.error('YouTube Player not ready for control actions.');
        return;
      }
  
      const command = {
        event: 'command',
        func: action,
      };
  
      if (action === 'mute') {
        playerIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'mute' }),
          '*'
        );
      } else if (action === 'unmute') {
        playerIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unmute' }),
          '*'
        );
      } else if (action === 'playVideo' || action === 'pauseVideo') {
        playerIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: action }),
          '*'
        );
      }
    };
  })();
  