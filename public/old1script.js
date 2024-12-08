(function () {
    const websocketURL = `ws://${location.hostname}:3000`; // Adjust port if necessary
    const playerIframe = document.getElementById('player');
    let isYouTubePlayerReady = false;


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
            console.log(event.data)
          const data = JSON.parse(event.data);
          if (data.type === 'url') {
            const videoID = extractVideoID(data.payload);
            if (videoID) {
              playerIframe.src = `https://www.youtube.com/embed/${videoID}?enablejsapi=1&autoplay=1&mute=1`;
              if (!isYouTubePlayerReady) {
                loadYouTubeAPI();
              }
            } else {
              console.error('Invalid YouTube URL received.');
            }
          } else if (data.type === 'control') {
            // Control player (play/pause)
            window.controlPlayer(data.action);
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      
    // socket.onmessage = (event) => {
    //   const youtubeURL = event.data;
    //   console.log(`Received YouTube URL: ${youtubeURL}`);
  
    //   // Extract video ID from the URL
    //   const videoID = extractVideoID(youtubeURL);
    //   if (videoID) {
    //     // Set the iframe's src to load the YouTube video
    //     //player.src = `https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1`;
    //     player.src = `https://www.youtube.com/embed/${videoID}?enablejsapi=1&autoplay=1&mute=1`;


      
    //     if (!isYouTubePlayerReady) {
    //         loadYouTubeAPI();
    //       }
  
    //     // Request fullscreen mode
    //     requestFullscreen(player);
    //   } else {
    //     console.error('Invalid YouTube URL received.');
    //   }
    // };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  

    function loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }


    // Extract YouTube video ID from the URL
    function extractVideoID(url) {
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  
    // Request fullscreen mode for the iframe
    function requestFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Safari and older iOS
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(); // Firefox
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE/Edge
      }
    }

    window.controlPlayer = (action) => {
        if (!isYouTubePlayerReady || !playerIframe.contentWindow) {
          console.error('YouTube Player not ready for control actions.');
          return;
        }
        playerIframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: action,
          }),
          '*'
        );
      };


  })();
  