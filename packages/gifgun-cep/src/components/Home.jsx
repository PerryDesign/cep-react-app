import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { store } from 'react-notifications-component';

import MoshModuleList from './MoshModuleList';
import AddModuleButton from './AddModuleButton';
import MoshButton from './MoshButton';
import MoshFunction from './MoshFunction';
import ActiveMoshLayerDisplay from './ActiveMoshLayerDisplay'
import FrameRemovalModule from './FrameRemovalModule'
import ScrollbarContainer from './ScrollbarContainer'
import {createLayer} from './createLayer'
import {deleteLayer} from './deleteLayer'
import {evalScript} from './evalScript'



const Home = ({isTrial,tmpDirPath,activeComposition, moshModules, previousMoshModules, setMoshModules,removeFrameModules,setRemoveFrameModules,swapModules,mapModules,syncing, setSyncing, syncingRef,activeItemComp, activeLayerKey, setActiveLayerKey, activeMVLayerIndex,activeSwapLayerIndex,activeMapLayerIndex,activeRemoveLayerIndex, OStype, scriptPath,frameRemovalAutoToggle,setFrameRemovalAutoToggle,frameRemovalToggle,setFrameRemovalToggle,deleteTempsToggle,debugMessage,setDebugMessage,useH264,setUseH264,accelThreshold,setAccelThreshold,useDebugMessage,usePrevRend,setUsePrevRend,showUsePrevRend,setShowUsePrevRend,previousPrimeKey,selectedOutput,setOutputTemplates,outputTemplates,ffmpegPath,ffeditPath,ffgacPath}) => {
    // State
    const [isRendering, setIsRendering] = useState(false)
    const [exportingMoshPhase, setExportingMoshPhase] = useState('ready');
    const previousPrimeLocation = useRef("");
    const [removeFrameThreshold,setRemoveFrameThreshold] = useState(50);
    var minusHeightCalc = showUsePrevRend && previousPrimeKey.current == activeLayerKey ? 103+34 : 103+0;
    


    // Use Effect
    useEffect(() => {
        console.log("moshModules =");
        console.log(moshModules);
        // console.log(`activeMVLayerIndex = ${activeMVLayerIndex.current} activeSwapLayerIndex = ${activeSwapLayerIndex.current} activeMapLayerIndex = ${activeMapLayerIndex.current} activeRemoveLayerIndex = ${activeRemoveLayerIndex.current}`);
        
        // If syncing Ref = true, update markers
        if(syncingRef.current && syncing){
            console.log("Gonna update markers")
            updateMarker().then((res)=>{
                console.log(res)
            });
        }
        // Reset sync
        if(!syncingRef.current){
            syncingRef.current = true;
        }

    },[moshModules]);

    useEffect(()=>{
        console.log('Rendering set to '+isRendering);
        isRendering ? setSyncing(false) : setSyncing(true);
    },[isRendering])


    // Functions
    function updateMarker(){
        return new Promise((resolve,reject) => {
            var currentModuleCount = moshModules.length;
            var previousModuleCount = previousMoshModules.current.length;
    
            // Do nothing on startup
            if(currentModuleCount == 0 && previousModuleCount == 0){
                resolve("Startup")
            }
            // Add
            else if(previousModuleCount < currentModuleCount){
                evalScript('placeMarker',{module: moshModules[moshModules.length-1], activeLayerIndex: activeMVLayerIndex.current, timeAdj:0}).then((res) => {resolve(res)});
            }
            // Delete
            else if (previousModuleCount > currentModuleCount){
                var deletedName;
                var deleteIndex
                for (var i = 0; i <= previousModuleCount-1; i++){
                    if(i == currentModuleCount){
                        deletedName = previousMoshModules.current[previousModuleCount-1].key;
                        deleteIndex = i;
                        break;
                    }
                    else if(previousMoshModules.current[i].key != moshModules[i].key){
                        deletedName = previousMoshModules.current[i].key;
                        deleteIndex = i;
                        break;
                    }
                }
                // Swap layer delete
                if(previousMoshModules.current[deleteIndex].preset.type == 'experimental'){
                    swapLayerHandler('delete', deletedName)
                }
                // Map layer delete
                if(previousMoshModules.current[deleteIndex].moshData.useMap){
                    mapLayerHandler('delete', deletedName)
                }
                evalScript('deleteMarker',{deletedName : deletedName, activeLayerIndex: activeMVLayerIndex.current}).then((res) => {resolve(res)});
            }
            // Update
            else if (previousModuleCount == currentModuleCount){
                var updateObj;
                var updateKey;
                var updated = false;
                for (var i = 0; i < currentModuleCount; i++){
                    if(previousMoshModules.current[i].updateKey != moshModules[i].updateKey){
                        updateObj = moshModules[i];
                        updateKey = previousMoshModules.current[i].updateKey;
                        // Update Swap
                        if(previousMoshModules.current[i].preset.type != 'experimental' && moshModules[i].preset.type == 'experimental'){
                            swapLayerHandler('new',moshModules[i].key);
                        }
                        if(previousMoshModules.current[i].preset.type == 'experimental' && moshModules[i].preset.type != 'experimental' && swapModules.current != 0){
                            swapLayerHandler('delete', moshModules[i].key);
                        }
                        // Update Map
                        if(previousMoshModules.current[i].moshData.useMap === true && moshModules[i].moshData.useMap !== true && mapModules.current != 0){
                            mapLayerHandler('delete', moshModules[i].key);
                        }
                        if(previousMoshModules.current[i].moshData.useMap !== true && moshModules[i].moshData.useMap === true){
                            mapLayerHandler('new', moshModules[i].key);
                        }
                        // Update Markers
                        evalScript('updateMarker',{modules : moshModules, activeLayerIndex: activeMVLayerIndex.current}).then((res) => {
                            console.log(res);
                            updated = true;
                            if(i+1 == currentModuleCount) resolve(res);
                        });
                    }
                    if(updated && i+1 == currentModuleCount){
                        resolve()
                    }
                }
    
            }
        // Update previousMoshModules
        previousMoshModules.current = moshModules;

        })
    }

    function swapLayerHandler(action,key){
        console.log("Begin Swap Module Count "+swapModules.current);

        // Make new layer
        if(action == 'new'){
            if(swapModules.current==0){
                console.log("Making swap layer")
                activeMVLayerIndex.current++
                if(activeSwapLayerIndex.current<activeMapLayerIndex.current)activeMapLayerIndex.current++
                createLayer('swap',activeLayerKey).then(() => {
                    activeSwapLayerIndex.current = 1;
                    makeMarker();
                    console.log('madeNew swapLayer')
                })
            }else{
                makeMarker()
            }
            swapModules.current++
        }
        // Delete 
        if(action == 'delete'){
            swapModules.current-- 
            console.log("Deleting swap modules")
            if(swapModules.current==0){
                console.log("Deleting swap layer")
                deleteLayer(activeSwapLayerIndex.current);
                if(activeSwapLayerIndex.current<activeMVLayerIndex.current)activeMVLayerIndex.current--
                activeSwapLayerIndex.current = -1
            }else{
                console.log(key)
                evalScript('deleteMarker',{deletedName : key, activeLayerIndex: activeSwapLayerIndex.current}).then((res) => {console.log(res)});
            }
        }

        // Make Marker
        function makeMarker(){
            var swapMarkerModule = {
                module: {
                    key:key,
                    preset:{
                        label: `Donor-${key}`,
                    },
                    duration: 1,
                    colorIndex: 11,
                },
                activeLayerIndex: activeSwapLayerIndex.current,
            }
            evalScript('placeMarker',swapMarkerModule).then((res) => {console.log(res)});
        };

        console.log("End Swap Module Count "+swapModules.current);
    }

    function mapLayerHandler(action,key){
        console.log("Begin Map Layer Count "+mapModules.current);
        // Make new layer
        if(action == 'new'){
            if(mapModules.current==0){
                console.log("Making map layer")
                activeMVLayerIndex.current++
                createLayer('map',activeLayerKey).then(() => {
                    activeMapLayerIndex.current = 1;
                    makeMarker();
                    console.log('madeNew mapLayer')
                })
            }else{
                makeMarker()
            }
            mapModules.current++
        }
        // Delete 
        if(action == 'delete'){
            mapModules.current-- 
            console.log("Deleting map modules")
            if(mapModules.current==0){
                console.log("Deleting map layer");
                deleteLayer(activeMapLayerIndex.current);
                if(activeMapLayerIndex.current<activeMVLayerIndex.current)activeMVLayerIndex.current--
                activeMapLayerIndex.current = -1
            }else{
                console.log(key)
                evalScript('deleteMarker',{deletedName : key, activeLayerIndex: activeMapLayerIndex.current}).then((res) => {console.log(res)});
            }
        }

        // Make Marker
        function makeMarker(){
            var mapMarkerModule = {
                module: {
                    key:key,
                    preset:{
                        label: `Map-${key}`,
                    },
                    duration: 1,
                    colorIndex: 11,
                },
                activeLayerIndex: activeMapLayerIndex.current,
            }
            evalScript('placeMarker',mapMarkerModule).then((res) => {console.log(res)});
        };

        console.log("End Map Layer Count "+mapModules.current);
    }
 
    // Render
    return(
    <HomeDiv>
        <MoshFunction
            tmpDirPath={tmpDirPath}
            exportingMoshPhase = {exportingMoshPhase}
            setExportingMoshPhase = {setExportingMoshPhase}
            isRendering = {isRendering}
            setIsRendering= {setIsRendering}
            moshModules = {moshModules}
            setMoshModules = {setMoshModules}
            previousMoshModules = {previousMoshModules}
            swapModules = {swapModules}
            mapModules = {mapModules}
            previousPrimeLocation = {previousPrimeLocation}
            activeMVLayerIndex = {activeMVLayerIndex}
            activeRemoveLayerIndex = {activeRemoveLayerIndex}
            activeSwapLayerIndex = {activeSwapLayerIndex}
            activeMapLayerIndex = {activeMapLayerIndex}
            scriptPath = {scriptPath}
            OStype = {OStype}
            frameRemovalToggle = {frameRemovalToggle}
            frameRemovalAutoToggle = {frameRemovalAutoToggle}
            removeFrameModules = {removeFrameModules}
            setRemoveFrameModules = {setRemoveFrameModules}
            removeFrameThreshold = {removeFrameThreshold}
            setRemoveFrameThreshold = {setRemoveFrameThreshold}
            deleteTempsToggle = {deleteTempsToggle}
            setDebugMessage = {setDebugMessage}
            debugMessage = {debugMessage}
            useH264 = {useH264}
            setUseH264 = {setUseH264}
            accelThreshold = {accelThreshold}
            useDebugMessage = {useDebugMessage}
            usePrevRend = {usePrevRend}
            setUsePrevRend = {setUsePrevRend}
            showUsePrevRend = {showUsePrevRend}
            setShowUsePrevRend = {setShowUsePrevRend}
            previousPrimeKey = {previousPrimeKey}
            activeLayerKey = {activeLayerKey}
            selectedOutput = {selectedOutput}
            setOutputTemplates = {setOutputTemplates}
            outputTemplates = {outputTemplates}
            ffmpegPath = {ffmpegPath}
            ffeditPath = {ffeditPath}
            ffgacPath = {ffgacPath}
        />

        <TopDiv isRendering = {isRendering}>
            <FrameRemovalModule
                activeItemComp = {activeItemComp}
                frameRemovalToggle= {frameRemovalToggle}
                setFrameRemovalToggle = {setFrameRemovalToggle}
                frameRemovalAutoToggle = {frameRemovalAutoToggle}
                setFrameRemovalAutoToggle = {setFrameRemovalAutoToggle}
                removeFrameModules = {removeFrameModules}
                setRemoveFrameModules = {setRemoveFrameModules}
                activeLayerKey = {activeLayerKey}
                setActiveLayerKey = {setActiveLayerKey}
                activeRemoveLayerIndex = {activeRemoveLayerIndex}
                removeFrameThreshold = {removeFrameThreshold}
                setRemoveFrameThreshold = {setRemoveFrameThreshold}
                useH264 = {useH264}
                setUseH264 = {setUseH264}
            />
        </TopDiv>
        <ModuleDiv isRendering={isRendering}>
            <ScrollbarContainer minusHeight={minusHeightCalc} type={'module'}>
                <MoshModuleList
                moshModules = {moshModules}
                setMoshModules = {setMoshModules}
                activeItemComp = {activeItemComp}
                isTrial = {isTrial}
                />
                <AddModuleButton
                activeItemComp = {activeItemComp}
                previousMoshModules = {previousMoshModules}
                moshModules = {moshModules}
                setMoshModules = {setMoshModules}
                activeMVLayerIndex = {activeMVLayerIndex}
                activeLayerKey = {activeLayerKey}
                setActiveLayerKey = {setActiveLayerKey}
                />
            </ScrollbarContainer>
        </ModuleDiv>
        <MoshButton
            usePrevRend = {usePrevRend}
            setUsePrevRend = {setUsePrevRend}
            showUsePrevRend = {showUsePrevRend}
            setShowUsePrevRend = {setShowUsePrevRend}
            activeItemComp = {activeItemComp}
            isRendering = {isRendering}
            setIsRendering= {setIsRendering}
            activeLayerKey = {activeLayerKey}
            previousPrimeKey = {previousPrimeKey}
        />
    </HomeDiv>
    )
}

 // Styling
 const HomeDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
 `

 const TopDiv = styled.div`
    display: ${props => props.isRendering  ? 'none' : 'flex'};
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    flex-direction: column;
    padding: 0px 10px 0px 10px;
    z-index: 1;
    box-shadow: 0px 0px 5px black;
 `

const ModuleDiv = styled.div`
    display: ${props => props.isRendering  ? 'none' : 'flex'};
    flex-direction: column;
    width: 100%;
    align-items: center;
`

export default Home