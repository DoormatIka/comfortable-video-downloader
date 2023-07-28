import md5 from "md5";
import { createReadStream } from "fs";

const file_hashes = [];

function generateChecksum(path: string) {
    const reader = createReadStream(path, 
        { 
            encoding: "utf-8", 
            highWaterMark: 2000 
        }
    );
    
    let num = 0;
    reader.on("data", (buf) => {
        console.log(buf.length);
        if (num >= 0) {
            file_hashes.push({
                hash: md5(buf),
                path: path
            });
            reader.close();
            reader.destroy();
            num = 0;
        }
        num++;
    });
}
// get the files inside a directory soon
// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
generateChecksum("./build/completed/MYUKKE#/MYUKKE. (All)/Zidanda Step [FREE DL].mp3");