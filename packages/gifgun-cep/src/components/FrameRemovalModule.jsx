import React from 'react'
import styled from 'styled-components'
import LabeledCheckbox from './LabeledCheckbox';
import LabeledInput from './LabeledInput';
import {createKey} from './createKey.jsx'
import {activeCompHandler} from './activeCompHandler.jsx'
import {evalScript} from './evalScript'
import {devMode} from '../DevMode';
import {Minus} from '@styled-icons/entypo'
import {Plus} from '@styled-icons/entypo'


const FrameRemovalModule = ({activeItemComp,frameRemovalToggle,setFrameRemovalToggle,frameRemovalAutoToggle,setFrameRemovalAutoToggle,removeFrameModules,setRemoveFrameModules,activeLayerKey,setActiveLayerKey,activeRemoveLayerIndex,removeFrameThreshold,setRemoveFrameThreshold,useH264,setUseH264}) => {


    // Removal Marker Module
    class removeModuleTemplate {
        constructor(label, key, updateKey){
            this.preset = {
                label : "Remove"
            },
            this.colorIndex = 10;
            this.key = key;
            this.updateKey = updateKey;
            this.in = 0;
            this.out = 0;
            this.duration = 0;
        }
    };



    // Functions
    const checkboxHandler = (e) => {
        if(activeCompHandler(activeItemComp.current)){
            var checkboxType = e.target.id;
            if(checkboxType == "removeFrames") setFrameRemovalToggle(!frameRemovalToggle)
            if(checkboxType == "autoRemove") setFrameRemovalAutoToggle(!frameRemovalAutoToggle)
            if(checkboxType == "useH264") setUseH264(!useH264)
        }
    }

    const rfDeleteButtonHandler = (e) => { 
        if(activeCompHandler(activeItemComp.current)){
            deleteRF();

            function deleteRF(){
                if(removeFrameModules.length != 0){
                    var deleteKey = removeFrameModules[removeFrameModules.length-1].key;
                    console.log("deleting key"+deleteKey)
                    deleteRemoveMarker(deleteKey);
                    setRemoveFrameModules(removeFrameModules.filter((el)=> el.key !== deleteKey))
                }
            }
            function deleteRemoveMarker(key){
                evalScript('deleteMarker',{deletedName : key, activeLayerIndex: activeRemoveLayerIndex.current}).then((res) => {});
            }
        }     
        
    }
    const rfAddButtonHandler = (e) => { 
        if(activeCompHandler(activeItemComp.current)){
            var newRemoveModule = new removeModuleTemplate("R",createKey("Remove Key"),createKey("Swap Remove Update Key"));

            addRF();

            function addRF(){
                setRemoveFrameModules([...removeFrameModules, newRemoveModule])
                activeRemoveLayerIndex.current == -1 ? createLayerAndAddMarker() : placeRemoveMarker();
            }

            // functions
            function createLayerAndAddMarker(){
                // Set layer key
                var layerKey;
                if(activeLayerKey.length == ''){
                    layerKey = createKey("New Remove Layer");
                    setActiveLayerKey(layerKey)
                }else{
                    layerKey = activeLayerKey;
                }

                evalScript('makeNewMoshLayer',{layerKey: layerKey, string: "Mosh-Remove-"}).then((res) => {
                    activeRemoveLayerIndex.current = 1;
                    placeRemoveMarker();
                });
            }
    
            function placeRemoveMarker(){
                console.log(newRemoveModule)
                evalScript('placeMarker',{module: newRemoveModule, activeLayerIndex: activeRemoveLayerIndex.current, timeAdj:0}).then((res) => {});
            }
        }     
        
    }

    const inputHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        console.log(e.target);
        if(activeCompHandler(activeItemComp.current)){
            setRemoveFrameThreshold(inputValue);
        }
    }


    // Render

    return(
        <FrameRemovalModuleDiv>
            <RFTopDiv>
                <LabeledCheckboxDiv>
                    <LabeledCheckbox
                        id={"removeFrames"}
                        label="Remove Frames"
                        checked={frameRemovalToggle}
                        onChange={checkboxHandler}
                        isVisible={true}
                    />
                </LabeledCheckboxDiv>
                <RFButtonsDiv isVisible={frameRemovalToggle}>
                    <RFIconButtonDiv onClick={rfDeleteButtonHandler} id={"rfMinus"}> <StyledMinus></StyledMinus> </RFIconButtonDiv>
                    <RFIconButtonDiv onClick={rfAddButtonHandler} id={"rfPlus"}> <StyledPlus></StyledPlus> </RFIconButtonDiv>
                </RFButtonsDiv>
            </RFTopDiv>
            <LabeledCheckbox
                id={"useH264"}
                label="Use H264"
                checked={useH264}
                onChange={checkboxHandler}
                isVisible={devMode && frameRemovalToggle}
            />
            {/* <LabeledCheckbox
                id={"autoRemove"}
                label="Automatically Remove"
                checked={frameRemovalAutoToggle}
                onChange={checkboxHandler}
                isVisible={frameRemovalToggle}
            /> */}
            {/* <LabeledInput
                id={"sceneThreshold"}
                label="Scene Threshold"
                value={removeFrameThreshold}
                onChange={inputHandler}
                isVisible={frameRemovalAutoToggle && frameRemovalToggle}
            /> */}
        </FrameRemovalModuleDiv>
    )
}

const FrameRemovalModuleDiv = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 30px;
    padding: 1.5px 0px 1.5px;
    justify-content: center;
`
const RFTopDiv = styled.div`
    align-items: center;
    width: 100%;
    display:flex;
    flex-direction:row;
`
const RFButtonsDiv = styled.div`
    align-items: center;
    display: ${props => props.isVisible ? 'flex' : 'none'};
    flex-direction:row;
    position: absolute;
    right: 70px;
`
const LabeledCheckboxDiv = styled.div`
    width: 100%;
`
const RFIconButtonDiv = styled.button`
    min-width: 29px;
    width: 33px;
    height: 25px;
    color: white;
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.background.dark};
    }
`
const StyledPlus = styled(Plus)`
    height:15px;
    width:15px;
`
const StyledMinus = styled(Minus)`
    height:15px;
    width:15px;
`
    // display: flex;
    // flex-direction: column;
    // box-sizing:border-box;
    // align-items: center;
    // width: 100%;
    // margin: 5px 0px 5px 0px;

export default FrameRemovalModule 