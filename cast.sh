#!/bin/bash

# Check if a YouTube URL argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a YouTube URL as an argument."
  exit 1
fi

# Store the YouTube URL from the first argument
youtube_url="$1"

youtube_url=$(/Users/Nirmal/.nvm/versions/node/v18.17.0/bin/yt-search "$youtube_url")


# Construct the JSON payload with the YouTube URL
payload="{\"youtubeURL\": \"$youtube_url\"}"

# Execute the curl command with the YouTube URL
curl -X POST -H "Content-Type: application/json" \
  -d "$payload" http://192.168.1.13:3000/send-url

# Check the curl exit code and display a message
if [ $? -eq 0 ]; then
  echo "YouTube URL broadcasted successfully"
else
  echo "Error: Failed to broadcast YouTube URL"
fi
