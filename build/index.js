import ytdl from "youtube-dl-exec";
import logger from "progress-estimator";
import { createReadStream } from "fs";
import split2 from "split2";
const LINK_PATH = "./links.txt";
const AUDIO_FORMAT = undefined;
const FORMAT = undefined;
const EXTRACT_AUDIO = undefined;
const KEEP_VIDEO = undefined;
const DUMP_JSON = true;
// no touchie unless you know what you're doing.
async function createDownloadSession(link) {
    const progress = logger({}); // progress bar initialization
    const res = ytdl(link, {
        retries: 3,
        continue: true,
        configLocation: "./",
        keepVideo: KEEP_VIDEO,
        extractAudio: EXTRACT_AUDIO,
        audioFormat: AUDIO_FORMAT,
        dumpSingleJson: DUMP_JSON,
        format: FORMAT,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]
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
