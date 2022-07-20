import {evalScript} from '../components/evalScript';

function checkForFFmpeg() {
    return new Promise((resolve,reject) => {

        const fs = require('fs');
        const pathModule = require('path');
        const os = require('os');
        var filesfound = [];
    
        
        checkAndGetSetting('ffmpegPath').then(path => {
            if(path) {
                var checkedPath = checkFilePath(path,'ffmpeg')
                if(checkedPath) filesfound.push(true);
                else filesfound.push(false)
                ending();
            }
            else {filesfound.push(false); ending()}
        })
        checkAndGetSetting('ffeditPath').then(path => {
            if(path) {
                var checkedPath = checkFilePath(path,'ffedit')
                if(checkedPath) filesfound.push(true);
                else filesfound.push(false);
                ending();
            }
            else {filesfound.push(false); ending()}
        })
        checkAndGetSetting('ffgacPath').then(path => {
            if(path) {
                var checkedPath = checkFilePath(path,'ffgac')
                if(checkedPath) filesfound.push(true);
                else filesfound.push(false)
                ending()
            }
            else {filesfound.push(false); ending()}
        })
        
        function checkAndGetSetting(settingName){
            return new Promise((resolve,reject) => {
                evalScript('haveSettings',{settingName: settingName}).then(json => {
                    var data = JSON.parse(json);
                    if(data.exists){
                        evalScript('getSettings', {settingName: settingName}).then(setting =>{ resolve(JSON.parse(setting)) });
                    }
                    else{ resolve(false) }
                })
            })
        }
        function checkFilePath(path,type){
            if(path) {
                var normalPath = pathModule.normalize(path);
                console.log(normalPath);
                if(fs.existsSync(normalPath) && !fs.lstatSync(normalPath).isDirectory() && pathModule.basename(normalPath).indexOf(type) != -1){
                    return(pathModule.resolve(normalPath));
                }else{
                    return(false)
                }
            }else return(false)
        }
        function ending(){
            if(filesfound.length == 3){
                var allFound = true;
                filesfound.map(found => {if(!found) allFound = false} )
                resolve(allFound)
            }
        }
    
    })
}

export {checkForFFmpeg};