# Datamosh-2
The second iteration to the original datamoshing tool for Adobe After Effects.


## About
Made using [adobe-cep-react-create](https://github.com/HendrixString/adobe-cep-react-create) and some components from [react-cep](https://github.com/sammarks/react-cep/tree/master/src). 

## Features

- Effect Motion Vectors with a variety of different alogrithms
  - Average motion vectors across many frames
  - Hold frames by **overlaying** freeze frames during mosh marker
  - Inject frames by **inserting** freeze frames during mosh marker
  - Add Duration and Interval
  - Control intensity 
  - Layer effects on top of eachother by averaging outputs
  - Only mosh in certain areas using a mask
- Transcribe motion vectors from one clip into another
- Remove I frames

BUild Commands

how to build
first run npm install, then choose

npm run build:dev / npm run build:prod - will build into ./dist folder
npm run deploy:dev / npm run deploy:prod - will deploy ./dist folder into the extension folder. if in dev mode, it will create a symbolic link, otherwise it will copy the entire folder.
npm run archive will create a self signed certificate and sign a ZXP package ready to publish
npm run release:dev / npm run release:prod - will build, deploy and archive (in production)
the output is a ./dist extension folder



# GifGun2.0-Template

This is part of a GifGun2 with only build steps needed to run license code.
Please follow the guideline at Licensing and replace name of the app with your own name in manifest.

Manifest is generated from template file called `manifest.ejs` with inlined data from `appVersion.js`

# How to build

 - `npm install`
 - `npm run build`


### CEP FOLDER

Folder where final package for CEP panel lives is located in packages/gifgun-cep/GifGun2
On OSX it can be linked to CEP directory via
calling this command from Repo root folder:

```
sudo ln -s "$(pwd)/packages/gifgun-cep/GifGun2" "/Library/Application Support/Adobe/CEP/extensions"
```

to unlink:

```
rm "/Library/Application Support/Adobe/CEP/extensions/GifGun2"
```

On Windows it can be linked using

-   go to `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`
-   run `mklink /D "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\GifGun2" "C:\CODE\MEHANIG_CODE\Gifgun2.0\packages\gifgun-cep\GifGun2"`

## Licensing

-   core license is used.
-   all the license code should be copied inside `src/licensing` before running the build
-   all the `require` calls with anything except pure string inside should be replaced to `window.require` manually. for example: OK - `require("fs")`, NOT OK: `require(Array.slice(...))` so -> `window.require(Array.slice(...)`
-   manually run `npm install` **<---!!!!NPM NOT YARN!!!** inside licensing and copy `node_modules` from licence to `\gifgun-cep\GifGun2\node_modules`
-   you need to copy manifest parts from webpack example to your manifest files, look for context with `.about` entry
