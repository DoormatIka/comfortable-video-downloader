# Comfortable Video Downloader
**DEPRECATED**: This is using a node.js wrapper for the ytdlp.exe. There are a lot of limitations with using the .exe instead of the main library.

## Installation
- Download this repo.
- Install node.js v18+
- Install ffmpeg: `http://www.ffmpeg.org/`
- Run `npm install` on the directory.
## Usage
`links.txt` is where you put Soundcloud, YouTube, whatever links.

Run the script with `npm run`

If you can't run using `ts-node`, go into `/build` and run `node index.js`.

The videos will be installed inside the `"completed/NA"` folder. Playlists will be installed inside a `"completed/{playlist name}"` folder.
## Info
This is a rewrite of Ctaehko's ChatGPT code of a Youtube Downloader.

![image](https://github.com/DoormatIka/comfortable-video-downloader/assets/68234036/832dcbda-1abc-45a7-b4fa-fa86797af0d1)

This was done for free, sadly.

## Feature TODO List
https://github.com/yt-dlp/yt-dlp#format-selection-examples

- Being able to choose the closest in filesize. ``
