import ytdl from "youtube-dl-exec";
import logger from "progress-estimator";
import { createReadStream } from "fs";
import split2 from "split2";
import internal from "stream";

const LINK_PATH = "./links.txt"
const EXTRACT_AUDIO = true;

async function createDownloadSession(link: string) {
    const progress = logger({}); // progress bar initialization
    const res = ytdl(link, {
        retries: 3,
        continue: true,
        configLocation: "./",
        extractAudio: EXTRACT_AUDIO,
        keepVideo: true,
    });
    const progress_bar_print = await progress(res, `Completing ${link}.`);
    console.log(`\n${progress_bar_print}`);
}
async function parser(links: internal.Transform) {
    for await (const link of links) {
        await createDownloadSession(link);
    }
}

const file = createReadStream(LINK_PATH, { encoding: "utf8" });
await parser(
    file
        .pipe(split2())
        .on("close", function() { file.destroy() })
);
file.destroy();