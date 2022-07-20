import React from 'react';
import presets from './presets';
import styled from 'styled-components';
import {createKey} from './createKey.jsx'
import AddButton from './AddButton'
import {createLayer} from './createLayer'
import {activeCompHandler} from './activeCompHandler.jsx'
import {evalScript} from './evalScript'


const AddModuleButton = ({activeItemComp,previousMoshModules,setMoshModules,moshModules, activeMVLayerIndex,activeLayerKey, setActiveLayerKey}) => {

    const submitToHandler = (e) => {
        e.preventDefault();
        if(activeCompHandler(activeItemComp.current)){
            var newModule = addModule()
            setMoshModules([...moshModules, newModule]);
        }
        // previousMoshModules.current= [...moshModules, newModuleObj];
    }

    // Functions

    function addModule(){
        var key = createKey("MoshModule module Key");
        var updateKey = createKey("MoshModule module updateKey");
        const newModuleObj = {
            key : key,
            updateKey : updateKey,
            index : moshModules.length,
            preset : {
                type: presets[0].type,
                value: presets[0].value,
                label: presets[0].label,
                mv0: presets[0].mv0,
                mv1: presets[0].mv1,
            },
            duration : 1,
            colorIndex : 14,
            markerIn : 0,
            markerOut : 2,
            moshData : {
                holdFrames: false,
                injectFrames: false,
                useMap: false,
                repeatFrames: 0,
                intensity: 50,
                acceleration: 0,
                duration: 0,
                interval: 0,
                blend: 0,
                threshold: 0,
                swapWI: 50,
                swapFI: 0,
                swapFO: 0,
                swapMarkerIn: 0,
                swapMarkerOut: 1,
                mapMarkerIn: 0,
                mapMarkerOut: 1,
            },
        }

        // Create layer if needed
        if(moshModules.length==0 && activeMVLayerIndex.current == -1){
            submitToCreateLayer()
        }
        return newModuleObj;
 
       
    }
    function submitToCreateLayer(){ 
        activeMVLayerIndex.current = 1;

        var layerKey;
        if(activeLayerKey.length == ''){
            layerKey = createKey("New MV Layer");
            setActiveLayerKey(layerKey)
        }else{
            layerKey = activeLayerKey;
        }
        createLayer('mv',layerKey).then(() => {
            console.log('madeNew moshLayer')
        })
    }

    return (
        <AddButtonContainer>
            <AddButton onClick={submitToHandler} visible={true}>+</AddButton>
        </AddButtonContainer>
    )
}

const AddButtonContainer = styled.div`
    display: flex;
    height: 15px;
    width: 100%;
    flex-direction: column;
    margin: 3px 0px 3px 0px;
    align-items:center;
`

export default AddModuleButton