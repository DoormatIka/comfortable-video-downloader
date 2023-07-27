import ytdl from "youtube-dl-exec";
import logger from "progress-estimator";
import fs from "fs";

async function createDownloadSession(link: string) {  
    const progress = logger({}); // progress bar initialization
    const res = ytdl(link, {
        retries: 3,
        continue: true,
        configLocation: "./",
    });
    const progress_bar_print = await progress(res, `Completing ${link}`);
    console.log(progress_bar_print);
}

async function parser(links: fs.ReadStream) {
    
}

// createDownloadSession(test.soundcloud)
createDownloadSession("https://www.youtube.com/watch?v=IKXDyKWXBhk");