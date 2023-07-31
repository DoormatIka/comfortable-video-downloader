import { createReadStream } from "fs";
import md5 from "md5";
import dir from "node-dir";
import path from "path";
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

identifyDuplicatesbyChecksum(__dirname)

export function identifyDuplicatesbyChecksum(folder_path: string) {
    return new Promise<Map<string, string[]>>((res, rej) => {
        dir.paths(folder_path, async (err, paths) => {
            if (err) rej(err);
    
            const bases = new Map<string, string[]>();
    
            for (const path_name of paths.files) {
                const encoded = md5(await getSurfaceBinaryofFile(path_name));
                const bases_res = bases.get(encoded);
                if (!bases_res) {
                    bases.set(encoded, [path_name]);
                } else {
                    bases_res.push(path_name);
                    bases.set(encoded, bases_res);
                }
            }
            res(bases)
        });
    })
}
export function deleteDuplicates(bases: Map<string, string[]>) {
    bases.forEach((paths, encoded) => {
        if (paths.length > 1) {
            // identify when you aren't supposed to delete something from a file
            // albums is not a good place, tracks is.
        }
    })
}

function getSurfaceBinaryofFile(file_path: string) {
    return new Promise<Buffer>((res, rej) => {
        let bytes_recieved = 0;
        let chunk_recieved = Buffer.from("filler");
        const file = createReadStream(file_path, {
            highWaterMark: 10000,
            encoding: "binary",
        });
        file
            .on("data", (chunk: Buffer) => {
                bytes_recieved += chunk.length;
                chunk_recieved = chunk;
                if (bytes_recieved > 10000) {
                    file.destroy();
                }
            })
            .on("close", () => res(chunk_recieved))
            .on("end", () => {
                file.destroy();
                res(chunk_recieved);
            })
            .on("error", rej)
    })
}