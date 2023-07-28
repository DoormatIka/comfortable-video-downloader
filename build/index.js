import ytdl from "youtube-dl-exec";
import logger from "progress-estimator";
import { createReadStream } from "fs";
import split2 from "split2";
const LINK_PATH = "./links.txt";
const AUDIO_FORMAT = undefined;
const FORMAT = "mp3";
const EXTRACT_AUDIO = true;
const KEEP_VIDEO = false;
// no touchie unless you know what you're doing.
async function createDownloadSession(link) {
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
        output: "completed/%(uploader)s/%(playlist)s/%(title)s.%(ext)s",
    });
    const progress_bar_print = await progress(res, `Completing ${link}.`);
    console.log(`\n${progress_bar_print}`);
}
async function parser(links) {
    for await (const link of links) {
        await createDownloadSession(link);
    }
}
const file = createReadStream(LINK_PATH, { encoding: "utf8" });
await parser(file
    .pipe(split2())
    .on("close", function () { file.destroy(); }));
file.destroy();
function mergeFormats(...format) {
    // equivalent to combining different formats into one
    // usage: mergeFormats("bestvideo", "worstaudio")
    return format.join("+");
}
function formatSeperate(...format) {
    // equivalent to separating formats into their own files
    return format.join(",");
}
function select(format, selected) {
    // equivalent to "ba.2" => "second best audio quality" and etc.
    // "ba.n"
    return `${format}${selected}`;
}
