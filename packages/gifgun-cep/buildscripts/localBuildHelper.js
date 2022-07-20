// rm -rf ./GifGun2/*.js
// rm -rf ./GifGun2/*.js.map
// rm -rf ./GifGun2/node_modules/*.chunk.js
// rm -rf ./GifGun2/node_modules/*.js.map
// mkdir -p ./GifGun2/CSXS
// mkdir -p ./GifGun2/node_modules
//
// cp -v -p ./build/main*.js ./GifGun2/
// cp -v -p ./build/*.chunk.js ./GifGun2/node_modules/
// cp -v ./build/index.html ./GifGun2/
// # This is optional part for Build_For_Web builder
// # TODO: FIX TO NOT FAIL FOR WEB
// cp -v ./build/settings.html ./GifGun2/
// cp -v -p ./build/manifest.xml ./GifGun2/CSXS/

const fs = require("fs");
const globSync = require("glob").glob.sync;
const baseName = require("path").basename;

const filesToCleanup = [
    ...globSync("./Datamosh2/*.js"),
    ...globSync("./Datamosh2/*.js.map"),
    ...globSync("./Datamosh2/node_modules/*.chunk.js"),
    ...globSync("./Datamosh2/node_modules/*.js.map"),
];

console.log("Cleaning" + filesToCleanup.join(","));
filesToCleanup.forEach(fs.unlinkSync);


// MAKE FOLDERS
if (!fs.existsSync("./Datamosh2")) {
    fs.mkdirSync("./Datamosh2");
}
if (!fs.existsSync("./Datamosh2/CSXS")) {
    fs.mkdirSync("./Datamosh2/CSXS");
}
if (!fs.existsSync("./Datamosh2/node_modules")) {
    fs.mkdirSync("./Datamosh2/node_modules");
}
if (!fs.existsSync("./Datamosh2/host")) {
    fs.mkdirSync("./Datamosh2/host");
}
if (!fs.existsSync("./Datamosh2/css")) {
    fs.mkdirSync("./Datamosh2/css");
}
if (!fs.existsSync("./Datamosh2/libs")) {
    fs.mkdirSync("./Datamosh2/libs");
}
if (!fs.existsSync("./Datamosh2/dialog")) {
    fs.mkdirSync("./Datamosh2/dialog");
}
if (!fs.existsSync("./Datamosh2/custom")) {
    fs.mkdirSync("./Datamosh2/custom");
}
if (!fs.existsSync("./Datamosh2/dialog/js")) {
    fs.mkdirSync("./Datamosh2/dialog/js");
}
// if (!fs.existsSync("./Datamosh2/static")) {
//     fs.mkdirSync("./Datamosh2/static");
// }
// if (!fs.existsSync("./Datamosh2/static/media")) {
//     fs.mkdirSync("./Datamosh2/static/media");
// }
// if (!fs.existsSync("./Datamosh2/assets")) {
//     fs.mkdirSync("./Datamosh2/assets");
// }
if (!fs.existsSync("./Datamosh2/assets/tutorial")) {
    fs.mkdirSync("./Datamosh2/assets/tutorial",  {recursive: true}  );
}
if (!fs.existsSync("./Datamosh2/assets/logo")) {
    fs.mkdirSync("./Datamosh2/assets/logo");
}
if (!fs.existsSync("./Datamosh2/assets/logo")) {
    fs.mkdirSync("./Datamosh2/assets/utility/mac/arm64", {recursive: true});
}
if (!fs.existsSync("./Datamosh2/assets/logo")) {
    fs.mkdirSync("./Datamosh2/assets/utility/mac/x", {recursive: true});
}
// if (!fs.existsSync("./Datamosh2/ffmpeg")) {
//     fs.mkdirSync("./Datamosh2/ffmpeg");
// }
if (!fs.existsSync("./Datamosh2/ffmpeg/MAC")) {
    fs.mkdirSync("./Datamosh2/ffmpeg/MAC", {recursive: true});
}
if (!fs.existsSync("./Datamosh2/ffmpeg/WIN")) {
    fs.mkdirSync("./Datamosh2/ffmpeg/WIN");
}


// FILES TO COPY
const filesToCopyToMain = [
    ...globSync("./build/main*.js"),
    ...globSync("./build/index.html"),
    ...globSync("./build/settings.html"),
];
const filesToCopyStaticMedia = [
    ...globSync("./build/static/media/*.gif"),
    ...globSync("./build/static/media/*."),
];
const filesToCopyToHost = [
    ...globSync("./src/host/main.jsx"),
    ...globSync("./src/host/json2.js"),
];
const filesToCopyToLibs = [
    ...globSync("./src/libs/CSInterface.js"),
    // ...globSync("./src/libs/ScriptLoader.js"),
];
const filesToCopyToCss = [
    ...globSync("./src/css/main.css"),
];
const filesToCopyAssetsTutorial = [
    ...globSync("./src/assets/tutorial/*.gif"),
    ...globSync("./src/assets/tutorial/*.svg"),
];
const filesToCopyAssetsLogo = [
    ...globSync("./src/assets/logo/*.png"),
];
const filesToCopyToFfmpeg = [
    ...globSync("./src/ffmpeg/glitchdocTemp.js"),
];
// const filesToCopyToFfmpegMac = [
//     ...globSync("./src/ffmpeg/MAC/ffmpeg"),
//     ...globSync("./src/ffmpeg/MAC/ffedit"),
//     ...globSync("./src/ffmpeg/MAC/ffgac"),
// ];
// const filesToCopyToFfmpegWin = [
//     ...globSync("./src/ffmpeg/WIN/ffmpeg.exe"),
//     ...globSync("./src/ffmpeg/WIN/ffedit.exe"),
//     ...globSync("./src/ffmpeg/WIN/ffgac.exe"),
// ];

const filesToCopyToCSXS = [...globSync("./build/manifest.xml")];

const filesToCopyToNodeModules = [...globSync("./build/*.chunk.js")];
const filesToCopyFromLicensingModules = [...globSync("./src/licensing/node_modules/*.*")]
const filesToCopyFromLicensingCustom = [...globSync("./src/licensing/custom/*.*")]
const filesToCopyFromLicensingdialog = [...globSync("./src/licensing/dialog/*.*")]
const filesToCopyFromLicensingdialogJs = [...globSync("./src/licensing/dialog/js/*.*")]

const copyFilesToFolder = (files, folder) => {
    files.forEach((f) => {
        const fileName = baseName(f);

        const destination = `${folder}${fileName}`;
        fs.copyFile(f, destination, (err) => {
            if (err) {
                throw err;
            }
            console.log(`${f} was copied to ${destination}`);
        });
    });
};

copyFilesToFolder(filesToCopyToMain, "./Datamosh2/");
copyFilesToFolder(filesToCopyFromLicensingCustom, "./Datamosh2/custom/");
copyFilesToFolder(filesToCopyFromLicensingdialog, "./Datamosh2/dialog/");
copyFilesToFolder(filesToCopyFromLicensingdialogJs, "./Datamosh2/dialog/js/");
// copyFilesToFolder(filesToCopyStaticMedia, "./Datamosh2/static/media/");
copyFilesToFolder(filesToCopyAssetsTutorial, "./Datamosh2/assets/tutorial/");
copyFilesToFolder(filesToCopyAssetsLogo, "./Datamosh2/assets/logo/");
copyFilesToFolder(filesToCopyToCSXS, "./Datamosh2/CSXS/");
copyFilesToFolder(filesToCopyToNodeModules, "./Datamosh2/node_modules/");
copyFilesToFolder(filesToCopyToHost, "./Datamosh2/host/");
copyFilesToFolder(filesToCopyToLibs, "./Datamosh2/libs/");
copyFilesToFolder(filesToCopyToCss, "./Datamosh2/css/");
copyFilesToFolder(filesToCopyToFfmpeg, "./Datamosh2/ffmpeg/");
// copyFilesToFolder(filesToCopyToFfmpegMac, "./Datamosh2/ffmpeg/MAC/");
// copyFilesToFolder(filesToCopyToFfmpegWin, "./Datamosh2/ffmpeg/WIN/");
