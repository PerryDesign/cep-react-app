import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {createKey} from './components/createKey.jsx'
import {evalScript} from './components/evalScript'
import {createNotification} from './components/createNotification'
import {checkForFFmpeg} from './components/checkForFFmpeg'


// Components
import presets from './components/presets';
import Navigator from './components/Navigator';
import Active from './components/Active';
// Tabs
import Home from './components/Home';
import Settings from './components/Settings';
import Info from './components/info/info';

const App = ({OStype,scriptPath, isTrial,tmpDirPath}) => {
    
    // Settings
    const [deleteTempsToggle, setDeleteTempsToggle] = useState(true);
    const [accelThreshold, setAccelThreshold] = useState(true);
    const [outputTemplates,setOutputTemplates] = useState([]);
    const DefaultOutputTemplate = {value:'Lossless with Alpha', label:'Lossless with Alpha'};
    const [selectedOutput,setSelectedOutput] = useState('');
    const [ffmpegPath,setFfmpegPath] = useState('');
    const [ffeditPath,setFfeditPath] = useState('');
    const [ffgacPath,setFfgacPath] = useState('');
    const [useDebugMessage,setUseDebugMessage] = useState(true);
    const [debugMessage,setDebugMessage] = useState([]);


    // Tab Changes
    useEffect(() => {
        console.log('Show used prev rend ' + activeTabIndex);
    },[showUsePrevRend]);
    const [showUsePrevRend, setShowUsePrevRend] = useState(false);
    const [usePrevRend, setUsePrevRend] = useState(false);
    const previousPrimeKey = useRef("");
    
    // State
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [activeLayerKey, setActiveLayerKey] = useState('');
    const previousLayerKey = useRef('');
    const activeItemComp = useRef(false);
    const activeMVLayerIndex = useRef(-1);
    const activeSwapLayerIndex = useRef(-1);
    const activeMapLayerIndex = useRef(-1);
    const activeRemoveLayerIndex = useRef(-1);
    
    const [frameRemovalAutoToggle, setFrameRemovalAutoToggle] = useState(false);
    const [frameRemovalToggle, setFrameRemovalToggle] = useState(false);
    const [useH264, setUseH264] = useState(false);
    
    const [moshModules, setMoshModules] = useState([]);
    const previousMoshModules = useRef([]);
    const swapModules = useRef(0);
    const mapModules = useRef(0);
    const [removeFrameModules,setRemoveFrameModules] = useState([]);
    
    const [syncing, setSyncing] = useState(true);
    const syncingRef = useRef(true);
    const lastSync = useRef(0);

    var pathModule = require('path');
    var fs = require('fs')
    
    // On Mount
    useEffect(()=>{
        // Open tutorial
        checkFirstOpen().then(res => {
            if(res){
                var cs = new CSInterface();
                cs.requestOpenExtension('com.aescripts.datamosh2.settings')
            }
        })
        // Import settings
        importSettings();
        recieveEvents();
    },[])

    
    // Tab Changes
    useEffect(() => {
        console.log('Tab changed to ' + activeTabIndex);
    },[activeTabIndex]);
    
    //Setting changes update saved
    useEffect(()=>{
        if(selectedOutput != '') saveSetting('selectedOutput', selectedOutput.value)
    }, [selectedOutput])
    useEffect(()=>{
        if(ffmpegPath.length != 0) saveSetting('ffmpegPath', ffmpegPath)
    }, [ffmpegPath])
    useEffect(()=>{
        if(ffeditPath.length != 0) saveSetting('ffeditPath', ffeditPath)
    }, [ffeditPath])
    useEffect(()=>{
        if(ffgacPath.length != 0) saveSetting('ffgacPath', ffgacPath)
    }, [ffgacPath])


    // Import settings
    var extension = OStype.current =="MAC" ? "" : ".exe";
    var ffmpegLocation = pathModule.join(tmpDirPath.current,("ffmpeg"+extension));
    var ffeditLocation = pathModule.join(tmpDirPath.current,("ffedit"+extension));
    var ffgacLocation = pathModule.join(tmpDirPath.current,("ffgac"+extension));
    function importSettings(){
        // Dont get outputTemplates because we want to load fresh ones every boot
        // checkAndGetSetting('outputTemplates').then(setting => {if(setting) setOutputTemplates(setting)})
        var missingFiles = [];
        var numChecked = 0;
        checkAndGetSetting('selectedOutput').then(setting => {
            //// **************************** NEEED TO CHANGE
            if(setting) setSelectedOutput({value: setting, label: setting});
            else{ setSelectedOutput(DefaultOutputTemplate)};
        })
        checkAndGetSetting('ffmpegPath').then(path => {
            if(path){
                var checkedPath = checkFilePath(path,'ffmpeg');
                if(checkedPath){
                    setFfmpegPath(checkedPath)
                }else{
                    setFfmpegPath(ffmpegLocation)
                    missingFiles.push('ffmpeg');
                }
            }else{
                setFfmpegPath(ffmpegLocation);
            }
            ++numChecked;
            importSettingsExit();
        })
        checkAndGetSetting('ffeditPath').then(path => {
            if(path){
                var checkedPath = checkFilePath(path,'ffedit');
                if(checkedPath){
                    setFfeditPath(checkedPath)
                }else{
                    setFfeditPath(ffeditLocation)
                    missingFiles.push('ffedit');
                }
            }else{
                setFfeditPath(ffeditLocation);
            }
            ++numChecked;
            importSettingsExit();
        })
        checkAndGetSetting('ffgacPath').then(path => {
            if(path){
                var checkedPath = checkFilePath(path,'ffgac');
                if(checkedPath){
                    setFfgacPath(checkedPath)
                }else{
                    setFfgacPath(ffgacLocation)
                    missingFiles.push('ffgac');
                }
                checkedPath ? setFfgacPath(checkedPath) : setFfgacPath(ffgacLocation);
            }else{
                setFfgacPath(ffgacLocation);
            }
            ++numChecked;
            importSettingsExit();
        })

        function importSettingsExit(){
            console.log('importSettingsEcit');
            console.log(missingFiles);
            console.log(numChecked);
            if(missingFiles.length != 0 && numChecked == 3){
                setTimeout( () => {dispatchMissingExternal(missingFiles)}, 3000);
            }
        }

    }
    function dispatchMissingExternal(paths){
        var missingString = '';
        paths.map((path,i) => {
            if(i != paths.length-1) missingString += path+', ';
            else{
                missingString+=path;
                paths.length == 1 ? missingString+=' does' : missingString+=' do';
            }
            
        });

        createNotification('missing external', `${missingString} not exist for the supplied path(s). Please check the settings or go to the tutorial and download the external files. If you are having issues, try manually installing by following the tutorial link in the settings tab.`);
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
    function checkAndGetSetting(settingName){
        return new Promise((resolve,reject) => {
            evalScript('haveSettings',{settingName: settingName}).then(json => {
                var data = JSON.parse(json);
                if(data.exists){
                    evalScript('getSettings', {settingName: settingName}).then(json =>{
                        var data = JSON.parse(json);
                        // var setting = data.setting
                        console.log("setting = " + data )
                        if(data != '') resolve(data);
                        else resolve(false);
                    });
                }
                else{ resolve(false) }
            })
        })
    }
    function saveSetting(settingName,value){
        return new Promise((resolve,reject) => {
            evalScript('saveSettings', {settingName: settingName, value: value}).then(res => {
                console.log("Saved "+settingName+"  with a value of "+value)
                resolve(res);
            })
        })
    }
    function checkFirstOpen(){
        return new Promise((resolve,reject) => {
            evalScript('haveSettings',{settingName: "firstLaunch"}).then(json => {
                var data = JSON.parse(json);
                if(data.exists){
                    resolve(false);
                }
                else{
                    saveSetting("firstLaunch",true);
                    resolve(true);
                 }
            })
        })
    }


    // Event Listeners
    function recieveEvents(){
        var cs = new CSInterface();
        cs.addEventListener( "com.aescripts.datamosh2.paths", function(e) {
            setFfmpegPath(ffmpegLocation);
            setFfeditPath(ffeditLocation);
            setFfgacPath(ffgacLocation);
        } );
    }


    // Sync
    const syncInterval = 300;
    useEffect(() => {
        previousLayerKey.current = activeLayerKey;
        // Run sync
        if(syncing){
            const  sync = setInterval(() => syncProject(), syncInterval);
            return () => clearInterval(sync);
        }
    },[activeLayerKey, syncing])

    function syncProject(){
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        var timeValue = hours*60*60+minutes*60+seconds
        var timeDifference = timeValue - lastSync.current
        // Check if enough time has elapsed
        if (timeDifference > syncInterval/1000){
            // console.log(`${hours}:${minutes}:${seconds}`);
            // Get Sync Data
            evalScript('getSyncData',{ activeLayerKey : activeLayerKey, mvIndex : activeMVLayerIndex.current, swapIndex :  activeSwapLayerIndex.current, mapIndex : activeMapLayerIndex.current, removeIndex : activeRemoveLayerIndex.current}).then(json => {
                
                // Variables
                var data = JSON.parse(json);
                var checkedKey = data.checkedKey;
                var checkedMVIndex = data.checkedMVIndex;
                var checkedSwapIndex = data.checkedSwapIndex;
                var checkedMapIndex = data.checkedMapIndex;
                var checkedRemoveIndex = data.checkedRemoveIndex;
                activeItemComp.current = data.activeItemComp;

                if (!activeItemComp.current){
                    // no Active comp
                    console.log("active Item is not comp or there are no layers")
                }
                // Check if any mosh layers
                else if(checkedKey.length != 0){
                    // Found a mosh layer, see if existing
                    if(checkedKey == previousLayerKey.current) {
                        // Found existing mosh layer, see if index change
                        updateExisting(checkedMVIndex,checkedSwapIndex,checkedMapIndex,checkedRemoveIndex)
                    }else if (checkedKey != activeLayerKey){
                        // Found a different mosh layer, let's load it
                        console.log("GOTTA LOAD! name is "+checkedKey+"  activeLayer was " + previousLayerKey.current);
                        importNew(checkedMVIndex,checkedSwapIndex,checkedMapIndex,checkedRemoveIndex,checkedKey)
                    };
                }
                // No Mosh Layer, delete modules
                else{
                    importNew(checkedMVIndex,checkedSwapIndex,checkedMapIndex,checkedRemoveIndex,checkedKey)
                }
                // Set Sync Time
                lastSync.current=timeValue;
            }).catch((error) => {
                errorHandler(error)
            });
        }else{
            // Execute when not enough time has passed
        }

    };

    function updateExisting(checkedMVIndex,checkedSwapIndex,checkedMapIndex,checkedRemoveIndex){
        // If MV layer changes
        if(checkedMVIndex != activeMVLayerIndex.current){
            console.log(`Key is correct, checkedMVIndex (${checkedMVIndex}) != Active Index (${activeMVLayerIndex.current})`);
            activeMVLayerIndex.current = checkedMVIndex;
            // if no MV layer, delete modules
            if(checkedMVIndex == -1) {
                console.log("MV layer deleted")
                setMoshModules([]);
                swapModules.current = 0;
            }
        }
        // If Swap or map Layer Changes 
        if(checkedSwapIndex != activeSwapLayerIndex.current || checkedMapIndex != activeMapLayerIndex.current){
            var swapDeleted = false;
            var mapDeleted = false;
            // if swap layer index moved
            if(checkedSwapIndex != activeSwapLayerIndex.current ){
                console.log(`Key is correct, checkedSwapIndex (${checkedSwapIndex}) != Active Index (${activeSwapLayerIndex.current})`);
                activeSwapLayerIndex.current = checkedSwapIndex;
                if(checkedSwapIndex === -1) swapDeleted = true;
            };
            // if map layer index moved
            if(checkedMapIndex != activeMapLayerIndex.current ) {
                activeMapLayerIndex.current = checkedMapIndex;
                console.log(`Key is correct, checkedMapIndex (${checkedMapIndex}) != Active Index (${activeMapLayerIndex.current})`);
                if(checkedMapIndex === -1) mapDeleted = true;
            };

            if(checkedSwapIndex == -1 || checkedMapIndex == -1){ 
                var updatedModules = [];
                // if no swap layer, update modules to non swap
                previousMoshModules.current.map((module) => {
                    if(module.preset.type == 'experimental' && swapDeleted){
                        swapModules.current = 0;
                        updatedModules.push({
                            ...module,
                            updateKey: createKey("Swap Layer Removed, need to change existing markers"),
                            preset: presets[0],
                        })
                    }
                    else if(module.moshData.useMap && mapDeleted){
                        mapModules.current = 0;
                        updatedModules.push({
                            ...module,
                            updateKey: createKey("Map Layer Removed, need to change existing markers"),
                            moshData: {
                                ...module.moshData,
                                useMap: false,
                            },
                        })
                    }
                    else{
                        updatedModules.push(module)
                    };
                })
                
                setMoshModules(updatedModules);
            }
        }
        // // If Map Layer Changes 
        // if(checkedMapIndex != activeMapLayerIndex.current){
        //     console.log(`Key is correct, checkedMapIndex (${checkedMapIndex}) != Active Index (${activeMapLayerIndex.current})`);
        //     activeMapLayerIndex.current = checkedMapIndex;
        //     if(checkedMapIndex == -1) {
        //         var updatedModules = [];
        //         console.log("Map layer deleted, updating modules.")
        //         // if no Map layer, update modules to non swap
        //         previousMoshModules.current.map((module) => {
        //             if(module.moshData.useMap){
        //                 updatedModules.push({
        //                     ...module,
        //                     updateKey: createKey("Map Layer Removed, need to change existing markers"),
        //                     moshData: {
        //                         ...module.moshData,
        //                         useMap: false,
        //                     },
        //                 })
        //             }
        //             else{
        //                 updatedModules.push(module)
        //             };
        //         })
        //         mapModules.current = 0;
        //         setMoshModules(updatedModules);
        //     }
        // }

        // If Remove index changes
        if(checkedRemoveIndex != activeRemoveLayerIndex.current){
            console.log(`Key is correct, checkedRemoveIndex (${checkedRemoveIndex}) != Active Index (${activeRemoveLayerIndex.current})`);
            activeRemoveLayerIndex.current = checkedRemoveIndex;
            if(checkedRemoveIndex == -1){
                setFrameRemovalToggle(false);
                setFrameRemovalAutoToggle(false);
            }
        }
    }

    function importNew(checkedMVIndex,checkedSwapIndex,checkedMapIndex,checkedRemoveIndex,checkedKey){
        // Update remove Frames
        if(checkedRemoveIndex == -1 && activeRemoveLayerIndex.current != -1) {
            setFrameRemovalToggle(false)
            setRemoveFrameModules([])
            // setFrameRemovalAutoToggle(true)
        };
        if(checkedRemoveIndex != -1) {
            setFrameRemovalToggle(true)
            importLayerData(checkedKey,checkedRemoveIndex).then(res => {
                setRemoveFrameModules(res)
            })
            // setFrameRemovalAutoToggle(false)
        };

        // Update MV modules
        if(checkedMVIndex != -1){
            // Get mosh data
            importLayerData(checkedKey,checkedMVIndex).then(res => {
                console.log('fetching new layer data ')
                // set Modules
                var amountOfExperimental = 0;
                var amountOfMap = 0;
                res.map(module => {
                    if(module.preset.type == 'experimental') amountOfExperimental++;
                    if(module.moshData.useMap) amountOfMap++;
                });
                console.log('amountOfExperimental = '+amountOfExperimental);
                console.log('amountOfMap = '+amountOfMap);
                swapModules.current = amountOfExperimental;
                mapModules.current = amountOfMap;
                previousMoshModules.current = res;
                setMoshModules(res);
            })
        }else if(moshModules.length != 0){
            console.log('Setting modules to []')
            swapModules.current = 0;
            mapModules.current = 0;
            previousMoshModules.current = [];
            setMoshModules([]);
        }

        // Set updated Indexs
        activeMVLayerIndex.current = checkedMVIndex;
        activeSwapLayerIndex.current = checkedSwapIndex;
        activeMapLayerIndex.current = checkedMapIndex;
        activeRemoveLayerIndex.current = checkedRemoveIndex;

        // Set prev Render
        setUsePrevRend(false);

        setActiveLayerKey(checkedKey);

    }

    function importLayerData(key,index){

        return new Promise((resolve,reject) => {

            evalScript('getLayerData',[ key, index ]).then(json => {
                var data = JSON.parse(json);
                console.log("layer data =");
                console.log(data);
                if(data.layerDataArray[0] == -1){data.layerDataArray = []}
                resolve(data.layerDataArray);
            }).catch((error) => {
                console.log("caught an error"+error);
            });

        })
    }

    function errorHandler(err){
        console.log(err);
        createNotification('error',("Something bad happened in App.jsx"+"\n"+err.name +"\n" + err.message));
    }



    // Tabs data
    const tabs = [
        {index: 0, title: "Home", comp : <Home
            isTrial={isTrial}
            tmpDirPath={tmpDirPath}
            moshModules={moshModules}
            previousMoshModules={previousMoshModules}
            setMoshModules={setMoshModules}
            removeFrameModules={removeFrameModules}
            setRemoveFrameModules={setRemoveFrameModules}
            swapModules={swapModules}
            mapModules={mapModules}
            syncing={syncing}
            setSyncing={setSyncing}
            syncingRef={syncingRef}
            activeItemComp = {activeItemComp}
            activeLayerKey = {activeLayerKey}
            setActiveLayerKey = {setActiveLayerKey}
            activeMVLayerIndex = {activeMVLayerIndex}
            activeSwapLayerIndex = {activeSwapLayerIndex}
            activeMapLayerIndex = {activeMapLayerIndex}
            activeRemoveLayerIndex = {activeRemoveLayerIndex}
            OStype = {OStype}
            scriptPath = {scriptPath}
            frameRemovalAutoToggle = {frameRemovalAutoToggle}
            setFrameRemovalAutoToggle = {setFrameRemovalAutoToggle}
            frameRemovalToggle = {frameRemovalToggle}
            setFrameRemovalToggle = {setFrameRemovalToggle}
            deleteTempsToggle = {deleteTempsToggle}
            debugMessage = {debugMessage}
            setDebugMessage = {setDebugMessage}
            useH264 = {useH264}
            setUseH264 = {setUseH264}
            accelThreshold = {accelThreshold}
            useDebugMessage = {useDebugMessage}
            usePrevRend = {usePrevRend}
            setUsePrevRend = {setUsePrevRend}
            showUsePrevRend = {showUsePrevRend}
            setShowUsePrevRend = {setShowUsePrevRend}
            previousPrimeKey = {previousPrimeKey}
            selectedOutput = {selectedOutput}
            setOutputTemplates = {setOutputTemplates}
            outputTemplates = {outputTemplates}
            ffmpegPath = {ffmpegPath}
            ffeditPath = {ffeditPath}
            ffgacPath = {ffgacPath}
        />},
        {index: 1, title: "Settings", comp : <Settings
            deleteTempsToggle = {deleteTempsToggle}
            setDeleteTempsToggle = {setDeleteTempsToggle}
            debugMessage = {debugMessage}
            setDebugMessage = {setDebugMessage}
            accelThreshold = {accelThreshold}
            setAccelThreshold = {setAccelThreshold}
            useDebugMessage = {useDebugMessage}
            setUseDebugMessage = {setUseDebugMessage}
            outputTemplates = {outputTemplates}
            setOutputTemplates = {setOutputTemplates}
            selectedOutput ={selectedOutput}
            setSelectedOutput = {setSelectedOutput}
            ffmpegPath = {ffmpegPath}
            setFfmpegPath = {setFfmpegPath}
            ffeditPath = {ffeditPath}
            setFfeditPath = {setFfeditPath}
            ffgacPath = {ffgacPath}
            setFfgacPath = {setFfgacPath}
            OStype = {OStype}
        />},
        {index: 2, title: "Info", comp : <Info
            deleteTempsToggle = {deleteTempsToggle}
            setDeleteTempsToggle = {setDeleteTempsToggle}
            debugMessage = {debugMessage}
            setDebugMessage = {setDebugMessage}
            accelThreshold = {accelThreshold}
            setAccelThreshold = {setAccelThreshold}
            useDebugMessage = {useDebugMessage}
            setUseDebugMessage = {setUseDebugMessage}
        />},
    ]

    // Render
    return(
        <ContainerDiv>
            <Active
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            />
            < Navigator
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={setActiveTabIndex}
            />
        </ContainerDiv>
    );
}

// Theme

const ContainerDiv = styled.div`
    display: flex;
    color: white;
    width: 100%;
`


export default App;