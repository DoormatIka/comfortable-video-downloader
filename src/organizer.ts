import fs from "fs";
import dir from "node-dir";
import url from 'url';
import extra from "fs-extra";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

ctaehkosOrganizer("No Playlist", "MYUKKEE");

/**
 * helper function, NAMES ONLY! paths aren't coded in
 * 
 * everything here will be a ducttape fix.
 * @param folders the folders that needs to be moved
 * @param target_folder the folder they get moved into
 */
function ctaehkosOrganizer(target_folder: string, artist_name: string, root_folder: string = "completed") {
    dir.paths(`${__dirname}${root_folder}\\${artist_name}`, (err, paths) => {
        if (err) throw err;
        mover(identifier(paths, target_folder));
    })
}
function identifier(paths: dir.PathsResult, target_folder: string) {
    let destination_folder_path = "";
    const starting_folder_paths: string[] = [];
    for (const dir of paths.dirs) {
        const last_folder = splitPath(dir).at(-1)!
        if (last_folder === target_folder) {
            destination_folder_path += dir;
        } else {
            starting_folder_paths.push(dir);
        }
    }
    return {
        destination_folder_path,
        starting_folder_paths
    }
}
function mover(pkg: { destination_folder_path: string, starting_folder_paths: string[] }) {
    for (const starting of pkg.starting_folder_paths) {
        extra.move(starting, `${pkg.destination_folder_path}\\${splitPath(starting).at(-1)!}`, (err) => {
            if (err) throw err;
            console.log(`Successfully moved: ${starting}.`);
        })
    }
}

function splitPath(path: string) {
    return path.split("\\");
}