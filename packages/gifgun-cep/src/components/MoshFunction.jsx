import { func } from 'prop-types';
import React from 'react';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import * as Sentry from "@sentry/browser";
import {createKey} from './createKey.jsx'
import {createNotification} from './createNotification'
import RenderPanel from './RenderPanel'
import {evalScript} from './evalScript'
import {checkForFFmpeg} from './checkForFFmpeg'
const through2 = require('through2');
const split2 = require('split2');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');





//Globals
const roundDecimal = 100;

const MoshFunction = ({tmpDirPath,isRendering, setIsRendering, exportingMoshPhase, setExportingMoshPhase, moshModules,swapModules,mapModules, setMoshModules,previousMoshModules, previousPrimeLocation, activeMVLayerIndex,activeRemoveLayerIndex,activeSwapLayerIndex,activeMapLayerIndex, scriptPath, OStype, frameRemovalToggle,frameRemovalAutoToggle,removeFrameModules,setRemoveFrameModules,removeFrameThreshold,deleteTempsToggle,debugMessage,setDebugMessage,useH264,setUseH264,accelThreshold,useDebugMessage,usePrevRend,showUsePrevRend,setShowUsePrevRend,previousPrimeKey,activeLayerKey,selectedOutput,setOutputTemplates,outputTemplates,ffmpegPath,ffeditPath,ffgacPath}) => {
    // Start Render
    useEffect(()=> {
        console.log("Is Rendering = " + isRendering);
        isRendering ?  setExportingMoshPhase('starting') : false;
    },[isRendering]);
    
    // Misc
    const debugMessageRef = useRef([]);
    const moshStepNum = useRef(0);
    const moshStepTotal = useRef(7);
    const [percentDone, setPercentDone] = useState(0)


    // Paths
    const projectPath = useRef("");
    const holdFramesDetected = useRef(false);
    const removeFramesDetected = useRef(false);
    const moshModulesDetected = useRef(false);
    const swapModulesDetected = useRef(false);
    const swapModulesCount = useRef(0);
    const mapModulesDetected = useRef(false);
    const mapModulesCount = useRef(0);
    const numOfSplits = useRef(0);
    const [extraRenderNum, setExtraRenderNum] = useState(0);
    const hfSplitListArray = useRef([]);
    const removeFrameModulesTimes = useRef([]);
    const mapBlockData = useRef([]);
    const compData = useRef({
        size: [],
        frameRate: 30,
        workAreaIn: 0,
        workAreaOut: 1,
        duration: 1,
    });
    const moshKey = useRef("");
    var slash = OStype.current == "MAC" ? "/" : "/";
    var pathModule = require('path');
    var projectFolder = pathModule.dirname(projectPath.current);
    var osDir = OStype.current;
    var moshFolder = pathModule.join(projectFolder,"mosh");
    
    // FFmpeg paths
    var ffmpegLocation = ffmpegPath;
    var ffgacLocation = ffgacPath;
    var ffeditLocation = ffeditPath;
    var glitchDocTempLocation = pathModule.join(scriptPath.current,"ffmpeg","glitchDocTemp.js");
    var glitchDocLocation = pathModule.join(moshFolder, "glitchdoc.js");

    var removeFrameTimesFile = OStype.current == "MAC" ? pathModule.join(moshFolder,"times.txt") : "C\\\\:"+moshFolder.slice(2)+slash +"times.txt";
    var rfSplitListFile = pathModule.join(moshFolder,"rfList.txt");
    // var hfSplitListFile = pathModule.join(moshFolder,"hfList.txt");
    var hfSplitListFile = moshFolder+slash+ "hfList.txt";
    var logFile = pathModule.join(moshFolder,`log-${moshKey.current}.txt`);

    const rendExt = useRef('');
    var rendFileLocation = pathModule.join(moshFolder,("rendFile"+rendExt.current));
    var primedFile =  pathModule.join(moshFolder, ("primedFile"+(useH264 ? '.avi' : '.mp4')));
    var swapTempFile = pathModule.join(moshFolder,"swapTemp");
    var swapPrimedFile = moshFolder+slash+"swapPrimed";
    var swapMVFiles = moshFolder+slash+"swapMV";
    var mapTempFile = pathModule.join(moshFolder,"mapTemp");
    var mapFrames =  pathModule.join(moshFolder,"mapFrames","map");
    var mapMVFiles = moshFolder+slash+"mapMV";
    var rfSplitFile = moshFolder+slash+"rfSplitFile";
    var rfConcatFile = pathModule.join(moshFolder,("rfConcatFile" + (holdFramesDetected.current ? '.mp4' : '.avi')) );
    var hfSplitFile = moshFolder + slash +"hfSplitFile";
    var hfConcatFile = pathModule.join(moshFolder,"hfConcatFile.avi");
    // var hfConcatFile = moshFolder + slash +"hfConcatFile.avi";
    var moshFileLocation = pathModule.join(moshFolder, "moshFile.mp4");
    var bakeFileLocation = pathModule.join(moshFolder, (moshKey.current + ".mp4"));

    // Log file
    var failedToLog = useRef(false)
    function logFFmpegData(data,stream){
        try{
            const logData = true;
            if(useDebugMessage){
                var msgArray = [...debugMessageRef.current, data];
                setDebugMessage(msgArray);
                debugMessageRef.current = msgArray
            }
            if(logData) console.log(data);
        }catch(err){
            if(!failedToLog.current) createNotification('error','Error creating log write stream!');
            failedToLog.current == true;
        }
    }
    function pushDebugMessage(data){
        if(useDebugMessage){
            var msgArray = [...debugMessageRef.current, data];
            setDebugMessage(msgArray);
            debugMessageRef.current = msgArray
        }
    }
    function writeDebugMsg(){
        try{
            if(useDebugMessage){
                var logStream = fs.createWriteStream(logFile, {flags: 'a'});
                // Pipe to log file
                for(var i = 0;i<debugMessage.length;i++){
                    logStream.write(`${debugMessage[i]}\n`);
                }
            };
        }catch(err){
            errorHandler(err);
        }
    }


    // Error handler
    function errorHandler(err){
        // Create notification
        console.log(err);
        createNotification('error',(err.name +"    " + err.message+"    "+"Ocurred at mosh phase "+exportingMoshPhase));

        // Push options to debug message
        pushDebugMessage('Error Detected: ERR.name =  '+ err.name+'   ERR.message =  '+err.message)
        if (moshModulesDetected) pushDebugOption('moshModules');
        if (removeFramesDetected) pushDebugOption('removeFrameModules');
        pushDebugOption('rendFileLocation');
        pushDebugOption('compData');
        pushDebugOption('glitchDocLocation');
        pushDebugOption('glitchDocTempLocation');
        pushDebugOption('outputTemplates');
        function pushDebugOption(optionString){
            if(optionString && optionString != ''){
                var value = eval(optionString);
                pushDebugMessage(JSON.stringify({
                    option: optionString,
                     value: value
                }));
            }
        }
        
        // End Mosh Phase
        setExportingMoshPhase('deleteTempFiles');
    }

    // Render Steps
    useEffect(()=> {
        console.log("MOSH PHASE = " + exportingMoshPhase + " MOSH Step = " + moshStepNum.current + " MOSH Total = " + moshStepTotal.current + " MOSH Perc = " + percentDone*100);
        pushDebugMessage("MOSH PHASE = " + exportingMoshPhase);
        switch(exportingMoshPhase) {
            case 'ready':
                break;
            case 'starting':
                setExportingMoshPhase('checkInFFmpeg')
                break
            case 'checkInFFmpeg':
                checkInFFmpeg()
                break
            case 'checkInModules':
                checkInModules()
                break
            case 'setPaths':
                setPaths()
                break
            case 'deletingPreviousMosh':
                moshStepNum.current++
                deletePreviousMosh();
                break
            case 'gettingCompData':
                getCompData();
                break
            case 'gettingMarkerTimes':
                getMarkerTimes();
                break
            case 'renderTemp':
                moshStepNum.current++
                renderTemp()
                break
            case 'renderExtraTemps':
                // moshStepNum.current++ happens in loop function
                renderExtraTemps()
                break
            case 'primeExtraTemps':
                moshStepNum.current++
                primeExtraTemps()
                break
            case 'exportExtraMVs':
                moshStepNum.current++
                exportExtraMVs()
                break
            case 'primeTemp':
                moshStepNum.current++
                primeTemp()
                break
            case 'rfGetTimes':
                rfGetTimes()
                break
            case 'rfSplitTemp':
                moshStepNum.current++
                rfSplitTemp()
                break
            case 'rfConcatTemps':
                moshStepNum.current++
                rfConcatTemps()
                break
            case 'hfSplit':
                hfSplit();
                break
            case 'hfCreateList':
                moshStepNum.current++
                hfCreateList();
                break
            case 'hfConcat':
                moshStepNum.current++
                hfConcat();
                break
            case 'generateGlitchDoc':
                moshStepNum.current++
                generateGlitchDoc()
                break
            case 'moshTemp':
                moshStepNum.current++
                moshTemp();
                break
            case 'bakingMosh':
                moshStepNum.current++
                bakeMosh();
                break
            case 'importingMosh':
                moshStepNum.current++
                importMosh();
                break
            case 'deleteTempFiles':
                deleteTempFiles(deleteTempsToggle,true);
                break
            case 'cleanUp':
                cleanUp();
                break
        }
        setPercentDone(moshStepNum.current/moshStepTotal.current); 
    },[exportingMoshPhase]);

    // ********* STEP FUNCTIONS *********

    function checkInFFmpeg(){
        checkForFFmpeg().then(exists => {
            if(exists) {
                setExportingMoshPhase('checkInModules')
            }else{
                createNotification('missing external',`One or more of the external executables does not exist in its current path. Please check the settings or go to the tutorial and download the external files. If you are having issues, try manually installing by following the tutorial link in the settings tab.`);
                setExportingMoshPhase('cleanUp');
            }
        })
    }
    function checkInModules(){
        if(removeFrameModules.length == 0 && frameRemovalToggle){
            errorHandler({name : "No remove markers.", message : `  Please uncheck the Remove Frames option or add at least one remove marker.`})
        }else{
            if(moshModules.length == 0 && !frameRemovalToggle){
                errorHandler({name : "No modules", message : `  Please add at least one Mosh module or a remove marker.`})
            }else setExportingMoshPhase('setPaths')
        }
    }
    
    function setPaths(){
        // set Debug mode
        setDebugMessage([]);
        debugMessageRef.current = [];
        // Set new Mosh Key
        moshKey.current = createKey("Mosh render ");
        // Check for mosh modules
        moshModules.length != 0 ? moshModulesDetected.current = true : moshModulesDetected.current = false; 
        // Check for swap modules
        swapModulesCount.current = 0;
        moshModules.map((module) => {
            if(module.preset.type == 'experimental'){
                console.log("found swap modules")
                swapModulesCount.current ++
            }
        })
        swapModulesCount.current != 0 ? swapModulesDetected.current = true : swapModulesDetected.current = false; 
        // Check for map modules
        mapModulesCount.current = 0;
        moshModules.map((module) => {
            if(module.moshData.useMap){
                console.log("found map modules")
                mapModulesCount.current ++
            }
        }) 
        mapModulesCount.current != 0 ? mapModulesDetected.current = true : mapModulesDetected.current = false;
        // Reset Extra Ren Num
        setExtraRenderNum(0);
        // Check for HF and RF
        removeFramesDetected.current = frameRemovalToggle;
        if(moshModulesDetected.current){
            holdFramesDetected.current = checkHoldFrame(moshModules)
            function checkHoldFrame(modules) {
                var i;
                for (i = 0; i < modules.length; i++) {
                    if (modules[i].moshData.holdFrames == true && modules[i].preset.type != 'experimental') {
                        return true;
                    }
                }
                return false;
            }
        }else{holdFramesDetected.current = false}
        // Set total Ren Steps
        moshStepTotal.current = 7;
        if(swapModulesDetected.current || mapModulesDetected.current) moshStepTotal.current += 2;
        if(swapModulesDetected.current) moshStepTotal.current += swapModulesCount.current+1;
        if(mapModulesDetected.current) moshStepTotal.current += mapModulesCount.current+1;
        if(frameRemovalToggle) moshStepTotal.current += 2;
        if(holdFramesDetected.current) moshStepTotal.current += 2;
        if(!moshModulesDetected.current) moshStepTotal.current += -2;
        // Delete old files
        deleteTempFiles(true,false)
        console.log(" does FFGAC location exist?  "+fs.existsSync(ffgacLocation));

        // Set Paths
        evalScript('getProjectPath').then(json => {
            var projPath = JSON.parse(json)
            projectPath.current = pathModule.resolve(projPath);
            // projectPath.current = OStype.current == "MAC" ? projPath : projPath.replace(/\\/g,"/");
            projectFolder = pathModule.dirname(pathModule.resolve(projPath));
            if(fs.existsSync(projectFolder)){
                fs.existsSync(pathModule.join(projectFolder,"mosh")) ? console.log("moshFolder Exists") : fs.mkdirSync(pathModule.join(projectFolder,"mosh"));
                !fs.existsSync(pathModule.join(projectFolder,"mosh","mapFrames")) ? fs.mkdirSync(pathModule.join(projectFolder,"mosh","mapFrames")) : console.log("map folder Exists");
                setExportingMoshPhase('deletingPreviousMosh');
            }else{
                errorHandler({name : "Can't seem to find the project folder at "+projectFolder, message : `  Try saving in a different location.`})
            }
        }).catch((err) => {
            errorHandler(err)
        })
    };

    function deletePreviousMosh(){
        if(fs.existsSync(primedFile) && !usePrevRend){
            fs.unlink(primedFile, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doesn't exist
                    alert("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    alert("Error occurred while trying to remove file");
                } else {
                    console.log('removed previous baked file: ' + primedFile);
                }
            });
            setExportingMoshPhase('gettingCompData')
        }else if(!fs.existsSync(previousPrimeLocation.current) && usePrevRend){
            errorHandler({name : "Previous render not found", message : `Could not find the previous render. Try unchecking 'Use previous render" and moshing again.`})
        }else{
            setExportingMoshPhase('gettingCompData')
        }

    }

    function getCompData(){
        evalScript('getCompData').then(json => {
            var data = JSON.parse(json);
            console.log(data)
            var evenDimension = true;
            if(data.size[0] % 2 != 0 || data.size[1] % 2 != 0) evenDimension = false;

            if(evenDimension){
                compData.current = data;
                setExportingMoshPhase('gettingMarkerTimes')
            }else{
                errorHandler({name : "", message : `Datamosh 2 requires the composition size to be even numbers. The current size is ${data.size[0]}x${data.size[1]}.`})
            }
        }).catch((err) => {
            errorHandler(err)
        })
    }

    function getMarkerTimes(){
        if(!moshModulesDetected.current){
            console.log("No mosh modules detected")
            setExportingMoshPhase('renderTemp')
        }else{
            
            var updatedModules = [];
            moshModules.map((module,i) => {
                // Get Module Time
                evalScript('getMarkerTime',{key: module.key, activeLayerIndex: activeMVLayerIndex.current}).then(timesStr => {
                    var times = JSON.parse(timesStr);
                    console.log(times)
                    pushTimesToModules(module,times,'mosh',i)
                    
                    // Get map layer keys if useMap is true
                    if(module.moshData.useMap){
                        evalScript('getMarkerTime',{key: module.key, activeLayerIndex: activeMapLayerIndex.current}).then(mapTimesStr => {
                            var mapTimes = JSON.parse(mapTimesStr);
                            console.log(mapTimes)
                            pushTimesToModules(module,mapTimes,'map',i);
                            
                            // If necessary, exit function
                            exitFunctionTimes(i,updatedModules);
                        }).catch((err) => {
                            errorHandler(err)
                        })
                    }
                    // Get swap layer keys if experimental
                    else if(module.preset.type == 'experimental'){
                        evalScript('getMarkerTime',{key: module.key, activeLayerIndex: activeSwapLayerIndex.current}).then(swapTimesStr => {
                            var expTimes = JSON.parse(swapTimesStr);
                            console.log(expTimes)
                            pushTimesToModules(module,expTimes,'swap',i);

                            // If necessary, exit function
                            exitFunctionTimes(i,updatedModules);
                        }).catch((err) => {
                            errorHandler(err)
                        })
                    }else{
                        // If necessary, exit function
                        exitFunctionTimes(i,updatedModules)
                    }
                }).catch((err) => {
                    errorHandler(err)
                })
                


            })

            function pushTimesToModules(module,times,type,i){
                
                // Push times to Update array
                if(type == 'swap') pushIntoExisting('swap');
                if(type == 'map') pushIntoExisting('map');
                if(type == 'mosh') pushModule();

                function pushModule(){
                    updatedModules.push({
                        ...module,
                        markerIn: times[0],
                        markerOut: times[1],
                    })
                }

                function pushIntoExisting(type){
                    updatedModules = updatedModules.map(updatedModule => {
                        if(updatedModule.key == module.key){
                            return {
                                ... updatedModule,
                                moshData : {
                                    ...updatedModule.moshData,
                                    swapMarkerIn : type == 'swap' ? times[0] : updatedModule.moshData.swapMarkerIn,
                                    swapMarkerOut : type == 'swap' ? times[1] : updatedModule.moshData.swapMarkerOut,
                                    mapMarkerIn : type == 'map' ? times[0] : updatedModule.moshData.mapMarkerIn,
                                    mapMarkerOut : type == 'map' ? times[1] : updatedModule.moshData.mapMarkerOut,
                                }
                            }
                        }else{
                            return updatedModule;
                        }
                    })
                }
                
            }

            function exitFunctionTimes(i,updatedModules){

                if(i == moshModules.length-1){
                    // Sort by MarkerIn
                    console.log(updatedModules)
                    if(moshModules.length != 1)updatedModules.sort((a, b) => a.markerIn - b.markerIn);
                    // Set Modules
                    previousMoshModules.current = updatedModules
                    setMoshModules(updatedModules);
                    setExportingMoshPhase('renderTemp');
                }

            }

        }
    }
    
    function renderTemp(){
        if(!usePrevRend){
            // If there are no output templates
            if(outputTemplates.length <= 1){
                evalScript('addToRenderGetTemplates').then(json => {
                    try{
                        var data = JSON.parse(json);
                        console.log(data);
                        pushDebugMessage('Into addToRenderGetTemplates');
                        pushDebugMessage(json);
                        setOutputTemplates(data.validTemplates);
                        // If the template exists
                        var templateExtension = checkAndGetTemplateExtension(data.validTemplates);
                        if(templateExtension != false){
                            // Add ext to Render path
                            rendExt.current = templateExtension;
                            console.log('rendFileLocation');
                            console.log(rendFileLocation);
                            evalScript('setTemplateAndTrigger',{location: `${rendFileLocation}`, template: selectedOutput}).then(res => {
                                pushDebugMessage('Into setTemplateAndTrigger; Result is '+res);
                                // Something happens after render or when fail
                                evalScript('openInViewer').then(res => {
                                    swapModulesDetected.current || mapModulesDetected.current ? setExportingMoshPhase('renderExtraTemps') : setExportingMoshPhase('primeTemp');
                                });
                            });
                        }
                        // If the template does not exist
                        else errorHandler({name : "The default template doesn't exist.", message : `Please select a different output template in the Datamosh 2 settings before moshing again.`});
                    }catch(err){
                        errorHandler(err)
                    }
                });
            }
            // If output templates have already been fetched
            else{
                try{
                    var templateExtension = checkAndGetTemplateExtension(outputTemplates);
                    if(templateExtension != false){
                        rendExt.current = templateExtension;
                        evalScript('addToRenderer',true).then(res => {
                            pushDebugMessage('Into addToRenderer');
                            evalScript('setTemplateAndTrigger',{location: `${rendFileLocation}`, template: selectedOutput}).then(res => {
                                pushDebugMessage('Into setTemplateAndTrigger; Result is '+res);
                                // Something happens after render or when fail
                                evalScript('openInViewer').then(res => {
                                    swapModulesDetected.current || mapModulesDetected.current ? setExportingMoshPhase('renderExtraTemps') : setExportingMoshPhase('primeTemp');
                                });
                            });
                        });
                    }
                    // If the template does not exist
                    else errorHandler({name : "The selected template doesn't exist.", message : `Please select a different output template in the Datamosh 2 settings before moshing again.`});
                }catch(err){
                    errorHandler(err)
                }
            }

            function checkAndGetTemplateExtension(fetchedOutputTemplates){
                var extension = false;
                for (var i=0; i<fetchedOutputTemplates.length; i++){
                        if(fetchedOutputTemplates[i].template == selectedOutput.value){
                            extension = fetchedOutputTemplates[i].ext;
                            break
                        }
                }

                return extension;
            }
            
        }else {
            swapModulesDetected.current || mapModulesDetected.current ? setExportingMoshPhase('renderExtraTemps') : setExportingMoshPhase('rfGetTimes');
        }
    }

    // Only for rendering Swap temps, ik it's not ideal..
    useEffect(() => {
        moshStepNum.current++
        if(exportingMoshPhase == 'renderExtraTemps') renderExtraTemps()
    },[extraRenderNum])

    function renderExtraTemps(){
        var renderedQuantity = 0;

        if (extraRenderNum == moshModules.length) exitFunction();
        else{
            try{
                var module = moshModules[extraRenderNum];
                console.log("Swap render num - "+extraRenderNum);
                console.log(module.preset.type);
                
                // If the module is a swap module
                if(module.preset.type == 'experimental'){
                    console.log("Experimental detected");
                    setWorkArea(module.moshData.swapMarkerIn, module.moshData.swapMarkerOut).then(res => {
                        evalScript('addToRenderer',true).then(res => {
                            evalScript('setTemplateAndTrigger',{location: `${swapTempFile}-${module.key+rendExt.current}`, template: selectedOutput}).then(res => {
                                renderedQuantity++;
                                setExtraRenderNum(extraRenderNum+1);
                            });
                        }).catch((err) => {
                            errorHandler(err);
                        });
                    })
                // If module is a map module
                }else if(module.moshData.useMap){
                    console.log(`map detected. Marker in = ${module.moshData.mapMarkerIn} Marker out = ${module.moshData.mapMarkerOut}`);
                    setWorkArea(module.moshData.mapMarkerIn, module.moshData.mapMarkerOut).then(res => {
                        evalScript('addToRenderer',true).then(res => {
                            evalScript('setTemplateAndTrigger',{location: `${mapTempFile}-${module.key+rendExt.current}`, template: selectedOutput}).then(res => {
                                renderedQuantity++;
                                setExtraRenderNum(extraRenderNum+1);
                            });
                        }).catch((err) => {
                            errorHandler(err);
                        });
                    });
                }else{
                    setExtraRenderNum(extraRenderNum+1);
                }
            }catch(err){
                errorHandler(err);
            }
        }
        
        function exitFunction(){
            console.log("exit function")
            evalScript('openInViewer').then(res => {
                setWorkArea(compData.current.workAreaIn,compData.current.workAreaOut);
                setExportingMoshPhase('primeExtraTemps');
            });
        }
    }

    function primeExtraTemps(){
        var renderedQuantity = 0;
        moshModules.map((module,i) => {
            if(module.preset.type == 'experimental'){
                var tempLocation = `${swapTempFile}-${module.key+rendExt.current}`;
                var primeLocation = `${swapPrimedFile}-${module.key}.mp4`;
                primeTemps(tempLocation,primeLocation,'swap').then(res => {
                    renderedQuantity++
                    if(renderedQuantity == swapModules.current+mapModules.current){
                        setExportingMoshPhase('exportExtraMVs');
                    }
                })
            }
            else if(module.moshData.useMap){ // If module is a map module
                var tempLocation = `${mapTempFile}-${module.key+rendExt.current}`;
                var primeLocation = `${mapFrames}-${module.key}-%05d.bmp`;
                primeTemps(tempLocation,primeLocation,'map').then(res => {
                    renderedQuantity++
                    if(renderedQuantity == swapModules.current+mapModules.current){
                        setExportingMoshPhase('exportExtraMVs');
                    }
                })
            }
        })

        function primeTemps(location,output,type){
            return new Promise((resolve,reject) => {
                var swapArgs = [
                    '-y',
                    '-hide_banner',
                    '-i', location,
                    '-an',
                    '-mpv_flags', 'nopimb+forcemv', 
                    '-qscale:v', '0', 
                    '-g', '1000', 
                    '-vcodec', 'mpeg4',
                    '-fcode', '6',
                    '-f', 'rawvideo', 
                    output,
                ];
                var mapArgs = [
                    '-y',
                    '-hide_banner',
                    '-i', location, 
                    '-pix_fmt', 'bgr8',  
                    output,
                ];
                var args = type == 'swap' ? swapArgs : mapArgs;
                console.log(`About to prome the ${type} temp`);
                var proc = spawn(ffgacLocation, args);

                proc.on('error', (err) => logFFmpegData('PRIMING ERROR!\n'+err,proc));
                proc.stderr.on('data', err => {logFFmpegData(err,proc)});
                proc.on('close', (data) => {
                    if (data != 0) {
                        errorHandler({name : "Priming extra error", message : `Something Went wrong with priming an extra render. Check the log.`});
                        console.log(data);
                    }
                    console.log('Okay, finished priming for Swap');
                    resolve();
                });
            })
        }
    }

    function exportExtraMVs(){
        var renderedQuantity = 0;
        moshModules.map((module,i) => {
            if(module.preset.type == 'experimental'){
                var primeSwapFile = `${swapPrimedFile}-${module.key}.mp4`;
                var swapMVFile = `${swapMVFiles}-${module.key}.json`;
                exportMVs(primeSwapFile,swapMVFile).then(res => {
                    renderedQuantity++
                    if(renderedQuantity == swapModules.current+mapModules.current){
                        setExportingMoshPhase('primeTemp')
                    }
                })
            }
            if(module.moshData.useMap){ // If module is a map module
                var duration = Math.round( (module.moshData.mapMarkerOut-module.moshData.mapMarkerIn) * compData.current.frameRate);
                exportBitmapData(module.key,duration).then(res => {
                    renderedQuantity++
                    var newMapBlocks = [
                        ...mapBlockData.current,
                        {
                            key: module.key,
                            data: res,
                        }
                    ]
                    mapBlockData.current = newMapBlocks;
                    if(renderedQuantity == mapModules.current+swapModules.current){
                        setExportingMoshPhase('primeTemp')
                    }
                })
            }
        });

        function exportMVs(input,output){
            return new Promise((resolve,reject) => {
                var args = [
                    '-hide_banner',
                    '-i', input,
                    '-f', 'mv:0',
                    '-e', output,
                ];
                var proc = spawn(ffeditLocation, args);
        
                proc.stdout.setEncoding('utf8');
                proc.stdout.on('data',data=> {logFFmpegData(`mosh stdout:\n${data}`,proc)});
                proc.stderr.on('data', err => {logFFmpegData('mosh stderr\n' +err,proc)});
                proc.on('close', (data) => {
                    console.log(`Okay, finsished exporting MVs \n ${data}`);
                    resolve();
                });
            })
        }

        // Bitmap functions
        function exportBitmapData(key,duration){
            return new Promise((resolve,reject) => {
                var mapBlockFrames = [];
                for(var i = 1; i < duration; i++){
                    var bitmapFile = `${mapFrames}-${key}-${numFillZeros(i,5)}.bmp`;
                    var bmp = require("bmp-js");
                    var bmpBuffer = fs.readFileSync(bitmapFile);
                    var bmpData = bmp.decode(bmpBuffer);
                    var pixelGrid = convertToGrid(bmpData);
                    var blockGrid = gridToBlocks(pixelGrid,16);
                    mapBlockFrames.push(blockGrid);
                }
                resolve( mapBlockFrames );
            });
        };

        function numFillZeros(num,length){
            var inLength = `${num}`.length;
            var delta = length-inLength;
            var zeros = ''
            for(var i = 0; i < delta; i++){
                zeros += '0';
            }
            return zeros+num;
        }

        function convertToGrid(data){
            var grid = [];
            for(var y = 0; y < data.height; y++){
                var row = [];
                for(var x = 0; x < data.width; x++){
                    var index = (x+y*data.width)*4;
                    var r = data.data[index];
                    var g = data.data[index+1];
                    var b = data.data[index+2];
                    var brightness = (r+g+b)/3;
                    row.push(brightness);
                }
                grid.push(row);
            }
            return grid;
        }

        function gridToBlocks(grid,blockSize){
            var blockGrid = [];

            for(var y=1; y<grid.length;y++){
                if(y%blockSize == 0){
                    var blockRow = []
                    for(var x=1;x<grid[y].length;x++){
                        if(x%blockSize==0) blockRow.push(grid[y-blockSize/2][x-blockSize/2])
                    }
                    blockGrid.push(blockRow);
                }
            }
            return blockGrid;
        }
    }

    function primeTemp(){
        try{
            if(!usePrevRend){
                var argsH264 = [
                    '-hide_banner',
                    '-i', rendFileLocation,
                    '-an',
                    '-b:v', '5000k', 
                    '-g', '1000', 
                    '-r', compData.current.frameRate,
                    '-bf', '0',
                    // '-coder', '0',
                    '-flags', 'qpel',
                    // '-flags2', '+fastpskip', // NOT WORKING
                    // '-subq', '8', // makes a difference
                    // '-refs', '16', //Made lil dif
                    // '-keyint_min', '200',  
    
                    // '-vtag', 'xvid',
                    // '-vcodec', 'libx264',
                    '-vcodec', 'libxvid',
                    primedFile,
                ];
                var args = [
                    '-y',
                    '-hide_banner',
                    '-i', rendFileLocation,
                    '-an',
                    '-mpv_flags', 'nopimb+forcemv', 
                    '-qscale:v', '2',
                    // '-flags', 'qpel',
                    '-fcode', '7', 
                    '-g', '1000', 
                    '-vcodec', 'mpeg4',
                    // '-bf', '0',
                    // '-r', compData.current.frameRate,
                    '-f', 'rawvideo', 
                    primedFile,
                ];
    
                var proc = spawn(useH264 ? ffmpegLocation : ffgacLocation, useH264 ? argsH264 : args);
                proc.on('error', err => errorHandler({name : "Priming temp error", message : `${err}`}));
                proc.stderr.on('data', err => {logFFmpegData('stderr prime\n' +err,proc)});
                proc.on('close', (data) => {
                    if (data != 0) errorHandler({name : "Priming temp error", message : `Something Went wrong with priming the render. Check the log. ${data}`});
                    else{
                        console.log('Okay, finished priming for RF');
                        // Set previous prime location
                        previousPrimeLocation.current = primedFile;
                        // Set previous prime key
                        previousPrimeKey.current = activeLayerKey;
                        setExportingMoshPhase('rfGetTimes')
                    }
                });
            }else{
                setExportingMoshPhase('rfGetTimes')
            }
        }catch(err){
            errorHandler(err)
        }
    }

    function rfGetTimes(){
        if(!frameRemovalToggle){
            console.log("Frame Removal not enabled, moving to hold Frames")
            setExportingMoshPhase('hfSplit')
        }else{
            // Decide which method - Auto v Manual
            manualGetRfTimes();
        }

        // Auto get times
        function autoGetRfTimes(){
            try{
                var printFilePath = OStype.current == "MAC" ? removeFrameTimesFile : moshFolder+"/times.txt"; // Will break on mac
                var args = [
                    '-hide_banner',
                    '-i', rendFileLocation,
                    '-an',
                    '-filter:v', `select='gt(scene,${removeFrameThreshold*.01})',metadata=print:file=${removeFrameTimesFile}`,
                    '-f', 'null',
                    '-',
                ];
                console.log(args)
                var proc = spawn(ffmpegLocation, args);
                proc.on('error', err => errorHandler({name : "RF get times error", message : `Something went wrong.`}));
                proc.stderr.on('data', err => {logFFmpegData('stderr fr times\n' +err,proc)});
                proc.on('close', (data) => {
                    try{
                        if (data != 0) errorHandler({name : "Remove Frame get times Auto Error", message : `Something Went wrong with getting Remove frame times. Check the log.`})
                        //Import times.txt
                        var file = fs.readFileSync(printFilePath, "utf8");
                        var txtArray = file.split(/ |\n/);
                        importTimesTxt(txtArray);
    
                        console.log(removeFrameModules);
                        console.log('Okay, finsished getting times for for RF');
                        setExportingMoshPhase('rfSplitTemp')
                    }catch(err){
                        errorHandler(err)
                    }
                });
            }catch(err){
                errorHandler(err)
            }
            // Additional functions
            function importTimesTxt(txtArray){
                var timesArray = [];
                console.log(txtArray)
                for(var i=0; i < txtArray.length; i++){
                    if(txtArray[i].includes("pts_time:")){
                        var time = parseFloat(txtArray[i].slice(9));
                        timesArray.push(time)
                    }
                }
                if(timesArray.length == 0) createNotification('error', "No remove frames dectected. Try decreasing the scene threshold!")
                removeFrameModulesTimes.current = timesArray;
            }
        };

        //Manual get times
        function manualGetRfTimes(){
            evalScript('getRFMarkerTime',{activeLayerIndex: activeRemoveLayerIndex.current}).then(timesStr => {
                var timesArray = JSON.parse(timesStr);
                var updatedTimesArray = [];
                var timesAreValid = true;
                timesArray.map(time => {
                    updatedTimesArray.push(time-compData.current.workAreaIn)
                    // Check if RF time is within the workspace. 
                    if(time-compData.current.workAreaIn < 0 || time > compData.current.workAreaOut) timesAreValid = false;
                })
                removeFrameModulesTimes.current = updatedTimesArray;
                console.log(removeFrameModulesTimes.current);
                console.log('Okay, finsished manually getting times for for RF');

                if(timesAreValid){
                    setExportingMoshPhase('rfSplitTemp')
                }else{
                    errorHandler({name : "Marker outside of workspace.", message : `Please make sure that your remove frame markers are within the workspace when moshing!`});
                } 

            }).catch((err) => {
                errorHandler(err)
            })
            
    

        };

    }

    function rfSplitTemp(){
        var rfModules = removeFrameModulesTimes.current
        if (rfModules.length == 0){
            console.log("Frame Removal not found, moving to hold Frames")
            removeFramesDetected.current = false;
            setExportingMoshPhase("hfSplit")
        }
        rfModules.map((time, i) => {
            const frameRate = compData.current.frameRate;
            var timeInFrames = Math.round(compData.current.frameRate*time);
            var timeInMs = `${(time)*1000}ms`;
            var timeInMsPlusOne = `${(time+(1/compData.current.frameRate))*1000}ms`;
            var timeInMsMinusOne = `${(time-(1/compData.current.frameRate))*1000}ms`;
            var timeInMsMinusTwo = `${(time-(2/compData.current.frameRate))*1000}ms`;
            var frameLength = 1/frameRate
            var previousTime = rfModules[i-1];
            var duration = time-previousTime;
            var previousTimeInMsPlusOne = previousTime+frameLength
            // First Split
            if(i == 0){
                streamCopySegment(primedFile,0,(time-frameLength),i,false,true)
            }
            // Middle Splits
            else{
                streamCopySegment(primedFile,previousTimeInMsPlusOne,(duration-frameLength-frameLength),i,false,true)
            }
            // Last Split
            if(i+1 == rfModules.length){
                streamCopySegment(primedFile,(time+frameLength),-1,(i+1),true,true)
            }

            
        });
        // Additional functions
        function streamCopySegment(inFile,timeIn,duration,i,end,useTime){
            var timeInMs = `${(timeIn)*1000}ms`;
            var args = [
                '-y',
                '-hide_banner',
                '-i', inFile, 
                '-vcodec', 'copy',
                '-copyinkf',
                '-ss', timeInMs,
            ];
            // Add frame Duration if necesarry
            if(duration != -1 && !useTime){
                args.push('-vframes');
                args.push(duration);
            }else if(duration != -1 && useTime){
                args.push('-t')
                args.push(duration);
            }

            // Add output
            args.push(`${rfSplitFile}${i}.${useH264 ? 'avi' : 'mp4'}`);

            console.log(args)
            var proc = spawn(ffmpegLocation, args);
            proc.on('error', err => errorHandler({name : "Split RF temp error", message : `Something Went wrong with splitting the temps. Check the log.`}));
            proc.stderr.on('data', err => {logFFmpegData('rf splitting '+i+'\n' +err,proc)});
            proc.on('close', (data) => {
                if (data !== 0) errorHandler({name : "Split RF temp error", message : `Something Went wrong with splitting the temps. Check the log.`});
                console.log('Okay, finsished RF splitting '+i+'\n'+data);
                if(end) endFunction();
            });

        };
        function writeSplitList(){
            return new Promise((resolve,reject) => {

                const writeStream = fs.createWriteStream(rfSplitListFile);
                const pathName = writeStream.path;
    
                // Push Split File Locations
                var locationArray = [];
                for(var i = 0;i <= removeFrameModulesTimes.current.length;i++){
                    var location = `file 'rfSplitFile${i}.${useH264 ? 'avi' : 'mp4'}'`;
                    locationArray.push(location);
                }
                console.log(locationArray)
    
                // Write List Ffile
                locationArray.forEach(value => writeStream.write(`${value}\n`));
                writeStream.on('finish', () => {
                   resolve(`wrote all the array data to file ${pathName}`);
                });
                writeStream.on('error', (err) => {
                    console.error(`There is an error writing the file ${pathName} => ${err}`)
                    proc.on('error', err => errorHandler({name : "Writing rf times error", message : `Something Went wrong.`}));
                });
                writeStream.end();
            })
        }
        function endFunction(){
            // setMoshModules(updatedModules);
            writeSplitList().then(res => {
                console.log(res)
                // Set Phase
                setExportingMoshPhase('rfConcatTemps');
            })
        }
    }

    function rfConcatTemps(){
        // ./ffgac -f concat -safe 0 -i list.txt -c copy  -copyinkf output.avi
        console.log(rfConcatFile);         
        var args = [
            '-y',
            '-hide_banner',
            '-f', 'concat', 
            '-safe', '0',
            '-i', rfSplitListFile, 
            '-c', 'copy', 
            '-copyinkf',
            rfConcatFile,
        ];
        var proc = spawn(ffmpegLocation, args);
        proc.on('error', err => errorHandler({name : "Concat temps error", message : `Something Went wrong with concatting temps`}));
        proc.stderr.on('data', err => {logFFmpegData('concatenating\n' +err,proc)});
        proc.on('close', (data) => {
            if (data != 0) errorHandler({name : "Remove Frame Concat Error", message : `Something Went wrong with concatting remove frame videos. Check the log.`})
            console.log('Okay, finsished RF concatenating ');
            setExportingMoshPhase('hfSplit')
        });

    }

    function hfSplit(){
        var updatedModules = [];
        if(!holdFramesDetected.current){
            console.log("No Hold Frame Found")
            setExportingMoshPhase('generateGlitchDoc')
        }
        else{
            try{
                console.log("Found Hold Frame");
                holdFramesDetected.current = true;
                const inFile = removeFramesDetected.current ? rfConcatFile : primedFile;
                const frameRate = compData.current.frameRate;
                const workAreaIn = compData.current.workAreaIn;
                const workAreaOutFrames = Math.round(roundDecimal*frameRate*compData.current.workAreaOut) / roundDecimal;
                const frameLengthMS = `${(1/frameRate)*100}ms`;
                const frameLengthUS = `${(1/frameRate)*1000000+10}us`;

                var numOfHolds = 0;
                var lastInjection = 0;
                var injectedLength = 0;

                moshModules.map((module,i) => {

                    adjustModules(module.key, injectedLength, frameRate);
                    if(module.moshData.holdFrames == true){
                        var inject = module.moshData.injectFrames;
                        var startTime = module.markerIn-workAreaIn;
                        var endTime = module.markerOut-workAreaIn;
                        var durationTime = endTime-startTime;
                        var startFrame = Math.round(startTime*frameRate)
                        var endFrame = Math.round(endTime*frameRate);
                        var durationFrame = Math.round(durationTime*frameRate);
                        var begDurationFrame = startFrame-Math.round(lastInjection*frameRate);
                        var lastInjectionUS = `${Math.round(lastInjection*1000000)}us`;
                        

                        // On Workspace Begin
                        if(startFrame == 0){
                            numOfSplits.current++
                            streamCopySegment(inFile,lastInjection,1,numOfSplits.current,false,true)
                            pushFileList(numOfSplits.current,durationFrame);

                            // Set injection times
                            if(!inject) lastInjection = durationTime;
                            if(inject) injectedLength += durationTime;
                        }
                        // On Workspace Middle
                        else if(startFrame != 0){
                            numOfSplits.current++
                            streamCopySegment(inFile,lastInjection,begDurationFrame,numOfSplits.current,false,false)
                            pushFileList(numOfSplits.current,1) 

                            numOfSplits.current++
                            streamCopySegment(inFile,startTime,frameLengthUS,numOfSplits.current,false,true)
                            pushFileList(numOfSplits.current,durationFrame) 
                            
                            // Set injection times
                            inject ? lastInjection = startTime : lastInjection = durationTime+startTime;
                            if(inject) injectedLength += durationTime;
                        }
                    }
                    // Add last split
                    if(i == moshModules.length-1){
                        numOfSplits.current++
                        streamCopySegment(inFile,lastInjection,-1,numOfSplits.current,true,false);
                        pushFileList(numOfSplits.current,1);
                    }
                })
            }catch(err){
                errorHandler(err)
            }
        }

        // Additional functions
        function streamCopySegment(inFile,timeIn,duration,i,end,useTime){
            var timeInMs = `${(timeIn)*1000}ms`;
            var timeInUs = `${timeIn*1000000-50}us`;
            var args = [
                '-y',
                '-hide_banner',
                '-i', inFile, 
                '-vcodec', 'copy',
                '-copyinkf',
                '-ss', timeInUs,
            ];
            // Add frame Duration if necessary
            if(duration != -1 && !useTime){
                args.push('-vframes');
                args.push(duration);
            }else if(duration != -1 && useTime){
                args.push('-t')
                args.push(duration);
            }

            // Add output
            args.push(`${hfSplitFile}${i}.mp4`);

            console.log(args)
            var proc = spawn(ffmpegLocation, args);
            proc.on('error', err => errorHandler({name : "hf split error", message : 'Splitting '+i+"   "+err}));
            proc.stderr.on('data', err => {logFFmpegData('splitting '+i+'\n' +err,proc)});
            proc.on('close', (data) => {
                console.log('Okay, finsished HF splitting '+i+"   "+data);
                if (data != 0) errorHandler({name : "Hold Frame Copy Error", message : `Something Went wrong with splitting hold frame video. Check the log.`})
                if(end) endFunction();
            });

        };
        function adjustModules(key, injectedTime, frameRate){
            moshModules.map(module => {
                if(module.key === key){
                    var oldIn = module.markerIn;
                    var oldOut = module.markerOut;
                    console.log("injected time is "+injectedTime);
                    console.log("previous in time is "+ oldIn);
                    updatedModules.push({
                        ...module,
                        markerIn: oldIn + injectedTime,
                        markerOut: oldOut + injectedTime,
                    })
                };
            })
            
        };
        function pushFileList(fileNum,copies){
            for(var i=1; i<=copies; i++){
                console.log(`Pushing file ${fileNum} Copies = ${copies}`)
                hfSplitListArray.current.push(`file 'hfSplitFile${fileNum}.mp4'`);
            }
        };
        function endFunction(){
            setMoshModules(updatedModules);
            setExportingMoshPhase('hfCreateList')
        }
    }

    function hfCreateList(){
        try{
            const writeStream = fs.createWriteStream(hfSplitListFile);
            const pathName = writeStream.path;

            console.log(hfSplitListArray.current)

            // Write List Ffile
            hfSplitListArray.current.forEach(value => writeStream.write(`${value}\n`));
            writeStream.on('finish', () => {
                console.log(`wrote all the array data to file ${pathName}`);
                setExportingMoshPhase('hfConcat');
            });
            writeStream.on('error', (err) => {
                if (data != 0) errorHandler({name : "Hold Frame Create List Error", message : `Something Went wrong with creating list for hold frame video. Check the log.`})
                console.error(`There is an error writing the file ${pathName} => ${err}`)
            });
            writeStream.end();

            // Set Phase
        }catch(err){
            errorHandler(err)
        }
    }

    function hfConcat(){
        try{
            var args = [
                '-y',
                '-hide_banner',
                '-f', 'concat', 
                '-safe', '0',
                '-i', hfSplitListFile, 
                '-c', 'copy',
                '-vsync','0',
                '-copyinkf',
                hfConcatFile,
            ];
            var proc = spawn(ffgacLocation, args);
            proc.on('error', err => errorHandler({name : "Concat hf temps error", message : `Something Went wrong with concatting hf temps`}));
            proc.stderr.on('data', err => {logFFmpegData('concatenating\n' +err,proc)});
            proc.on('close', (data) => {
                if (data != 0) errorHandler({name : "Hold Frame Concat Error", message : `Something Went wrong with concatting hold frame video. Check the log.`})
                console.log('Okay, finsished hF concatenating ');
                setExportingMoshPhase('generateGlitchDoc')
            });
        }catch(err){
            errorHandler(err)
        }
    }

    function generateGlitchDoc(){
        if(!moshModulesDetected.current){
            setExportingMoshPhase('bakingMosh')
        }else{
            try{
                var rStream = fs.createReadStream(glitchDocTempLocation);
                var wStream = fs.createWriteStream(glitchDocLocation);
                
        
                // var moshInstructionsObj = moshModules.map(module => {})
                // console.log(moshModules);
                var moduleMVData = [];
                // Import json MVs
                if(swapModulesDetected.current) importMVs()
                function importMVs(){
                    moshModules.map((module,i) => {
                        var swapMVFile = `${swapMVFiles}-${module.key}.json`;
                        if(module.preset.type == 'experimental'){
                            var mvsJson = fs.readFileSync(swapMVFile);
                            var mvsObj = JSON.parse(mvsJson);
                            moduleMVData.push({
                                key : module.key,
                                mvs : mvsObj.streams[0].frames,
                            });
                        }
                    })
                }
        
                var moshInstructions = {
                    accelThreshold : accelThreshold,
                    compData : compData.current,
                    modules : moshModules,
                    moduleMVData : moduleMVData,
                    mapBlockData: mapBlockData.current,
                }
                console.log(moshInstructions)
                var lineCounter = 0;
                var stream = through2({ objectMode: true }, function(chunk, enc, cb) {
                    lineCounter++
                    var newChunk = chunk;
                    if(lineCounter == 2){
                        // Insert Options
                        newChunk = JSON.stringify(moshInstructions);
                    }      
                    this.push(newChunk+'\r')
                    cb()
                });
                rStream.pipe(split2()).pipe(stream).pipe(wStream);
                
                rStream.on('error', () => {errorHandler({name : "generateGlitchDocError", message : `Something Went wrong with generating the glitch doc. Read Error. Check the log.`})})
                wStream.on('error', () => {errorHandler({name : "generateGlitchDocError", message : `Something Went wrong with generating the glitch doc. Write Error. Check the log.`})})
                wStream.on('close', () => {
                    setExportingMoshPhase('moshTemp');
                })
                // Error Handler
            }catch(err){
                errorHandler(err)
            }
        }

    }

    function moshTemp(){
        try{
            var inFile = primedFile;
            if(removeFramesDetected.current) inFile = rfConcatFile;
            if(holdFramesDetected.current) inFile = hfConcatFile;
    
            var args = [
                '-y',
                '-hide_banner',
                '-i', inFile,
                '-f', 'mv',
                '-s', glitchDocLocation,
                '-o', moshFileLocation,
            ];
            var proc = spawn(ffeditLocation, args);
    
            proc.stdout.setEncoding('utf8');
            proc.on('error', err => errorHandler({name : "Mosh temps error", message : `Something Went wrong with moshing temps`}));
            proc.stdout.on('data',data=> {logFFmpegData(`mosh stdout:\n${data}`,proc)});
            proc.stderr.on('data', err => {logFFmpegData('mosh stderr\n' +err,proc)});
            proc.on('close', (data) => {
                if (data != 0) errorHandler({name : "Moshing Error", message : `Something Went wrong with moshing the video. Check the log.`})
                console.log(`Okay, finsished moshing \n ${data}`);
                setExportingMoshPhase('bakingMosh');
            });
        }catch(err){
            errorHandler(err)
        }
    }

    function bakeMosh(){
        try{
            const inFile = moshModulesDetected.current ? moshFileLocation : rfConcatFile;
            var args = [
                '-y',
                '-err_detect', 'ignore_err',
                '-i', inFile,
                '-qscale:v', '3',
                '-loglevel', 'fatal',
                '-hide_banner',
                bakeFileLocation,
            ];
            var proc = spawn(ffmpegLocation, args);
            proc.on('error', err => errorHandler({name : "Baking error", message : `Something Went wrong with baking temps  ${err}`}));
            proc.stdout.on('data',data=> {logFFmpegDatag(`Bake stdout:\n${data}`,proc)});
            proc.stderr.on('data', err => {logFFmpegData(`Baking stderr\n${err}`,proc)});
            proc.on('close', (data) => {
                if (data != 0) errorHandler({name : "Baking Error", message : `Something Went wrong with moshing the video. Check the log.  ${data}`})
                console.log('Okay, finsished baking');
                setExportingMoshPhase('importingMosh');
            });
        }catch(err){
            errorHandler(err);
        }
    }

    function importMosh(){

        evalScript('importBakedFile',{file : bakeFileLocation, time : compData.current.workAreaIn}).then(res => {
            console.log(res);
            setShowUsePrevRend(true);
            setExportingMoshPhase('deleteTempFiles');
        }).catch((err) => {
            errorHandler(err)
        })
    }

    function deleteTempFiles(active, finish){
        if(active == true){
            deleteFile(rendFileLocation);
            // deleteFile(primedFile);
            deleteFile(moshFileLocation);
            deleteFile(rfSplitListFile);
            deleteFile(hfSplitListFile);
            deleteFile(rfConcatFile);
            deleteFile(hfConcatFile);
            deleteFile(glitchDocLocation);
            deleteFile(glitchDocLocation);
            // Delete Swap Temps
            for(var i = 0; i < moshModules.length;i++){
                if(moshModules[i].preset.type == "experimental"){
                    var module = moshModules[i];
                    var swapTemp = `${swapTempFile}-${module.key}${rendExt.current}`;
                    var swapPrimed = `${swapPrimedFile}-${module.key}.mp4`;
                    var swapMVs = `${swapMVFiles}-${module.key}.json`;
                    deleteFile(swapTemp);
                    deleteFile(swapPrimed);
                    deleteFile(swapMVs);
                }
            }
            // Delete Map Temps
            for(var i = 0; i < moshModules.length;i++){
                if(moshModules[i].moshData.useMap){
                    var module = moshModules[i];
                    var mapTemp = `${mapTempFile}-${module.key}${rendExt.current}`;
                    deleteFile(mapTemp);
                }
            }
            // Delete Map BMPs
            var mapFolder = pathModule.join(moshFolder,'mapFrames');
            if(fs.existsSync(mapFolder)){
                fs.readdir(mapFolder, (err, files) => {
                    console.log(files)
                    if(err && err.code == 'ENOENT') {
                        // file doesn't exist
                        console.log("Map folder doesn't exist, won't remove it.");
                    } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.log("Error occurred while trying to remove file");
                    }
                    for (const file of files) {
                      deleteFile(pathModule.join(mapFolder,file))
                    }
                });
            }
            // Delete RF Splits
            for(var i=0 ; i <= removeFrameModulesTimes.current.length; i++){
                var splitPath = `${rfSplitFile}${i}.${useH264 ? 'avi' : 'mp4'}`
               deleteFile(splitPath);
            };
            // Delete HF Splits
            for(var i=0 ; i <= numOfSplits.current; i++){
                var splitPath = hfSplitFile + i + ".mp4";
               deleteFile(splitPath);
            };
        }


        if(finish) setExportingMoshPhase('cleanUp')
    }

    function cleanUp(){
        // Write Debug Log
        writeDebugMsg();

        //Reset hf Split Array
        hfSplitListArray.current = [];
        numOfSplits.current = 0;
        moshStepNum.current = 0;

        //reset Map Modules
        mapBlockData.current = [];

        
        setIsRendering(false);
        setExportingMoshPhase('ready');
    }

    // RENDER
    return(
        <RenderFunctionDiv isRendering={isRendering}>
            <RenderPanel
                moshStepTotal = {moshStepTotal}
                moshStepNum = {moshStepNum}
                percentDone = {percentDone}
                exportingMoshPhase = {exportingMoshPhase}
                setExportingMoshPhase = {setExportingMoshPhase}
            />
        </RenderFunctionDiv>
    )
    
}

// Additional Functions

function deleteFile(filePath){
    var fileNameArray = filePath.split("/");
    var fileName = fileNameArray[fileNameArray.length-1];
    fs.unlink(filePath, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.log(fileName + " doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.log("Error occurred while trying to remove file" + fileName);
        } else {
            console.log('removed');
        }
    });
}

function setWorkArea(timeIn,timeOut){
    return new Promise((resolve,reject)=>{
        evalScript('setWorkArea',{timeIn :timeIn, timeOut : timeOut}).then(res => {
            console.log(`res = ${res} timeIn = ${timeIn} timeOut = ${timeOut}`);
            resolve(res);
        });
    });
}

// Style

const RenderFunctionDiv = styled.div`
    display: ${props => props.isRendering ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`





export default MoshFunction