import ytdl from "youtube-dl-exec";
import logger from "progress-estimator";
import { createReadStream } from "fs";
import split2 from "split2";
import internal from "stream";
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// WHAT IS THIS??
// FORMAT: https://github.com/yt-dlp/yt-dlp#format-selection-examples
// OUTPUT: https://github.com/yt-dlp/yt-dlp#output-template
type FORMAT_TYPE = 
    "3gp" | "aac" | "flv" | "m4a" | "mp3" | "mp4" | "ogg" | "wav" | "webm" | 
    "best" | "best*" | "bestvideo" | "bestvideo*" | "bestaudio" | "bestaudio*" |
    "worst*" | "worst" | "worstvideo" | "worstvideo*" | 
    "worstaudio" | "worstaudio*" | undefined;
type AUDIO_FORMAT_TYPE = "mp4a.40.5" | "mp4a.40.2" | "opus" | "mp3" | undefined;

const LINK_PATH = __dirname + `\\config\\links.txt`
const AUDIO_FORMAT: AUDIO_FORMAT_TYPE = undefined;
const FORMAT = select("best", 3);

// POST-PROCESSING
const EXTRACT_AUDIO = undefined;
const KEEP_VIDEO = true;

// no touchie unless you know what you're doing.
async function createDownloadSession(link: string) {
    const progress = logger({}); // progress bar initialization
    const res = ytdl(link, {
        retries: 3,
        continue: true,
        keepVideo: KEEP_VIDEO,
        extractAudio: EXTRACT_AUDIO,
        audioFormat: AUDIO_FORMAT,
        format: FORMAT,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ],
        printJson: true, // needed to access the fucking stuff inside YtResponse
        output: "src/completed/%(uploader|No Uploader)s/%(album,playlist|No Playlist)s/%(playlist_index)s-%(title)s.%(ext)s",
        configLocation: __dirname + `\\config`
    });
    const youtube_response = await progress(res, `Downloading ${link}`);
    console.log(youtube_response?._filename); // unreliable
}

async function parser(links: internal.Transform) {
    for await (const link of links) {
        await createDownloadSession(link);
    }
}

const file = createReadStream(LINK_PATH, { encoding: "utf8" });
await parser(
    file.pipe(split2())
        .on("close", function() { file.destroy() }));
file.destroy();

function mergeFormats(...format: (FORMAT_TYPE | AUDIO_FORMAT_TYPE | string)[]) {
    // equivalent to combining different formats into one
    // usage: mergeFormats("bestvideo", "worstaudio")
    return format.join("+");
}
function formatSeperate(...format: (FORMAT_TYPE | AUDIO_FORMAT_TYPE | string)[]) {
    // equivalent to separating formats into their own files
    return format.join(",");
}
function select(format: FORMAT_TYPE, selected: number) {
    // equivalent to "ba.2" => "second best audio quality" and etc.
    // "ba.n"
    return `${format}.${selected}`;
}