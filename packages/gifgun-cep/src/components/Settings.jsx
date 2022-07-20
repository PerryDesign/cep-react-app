import React from 'react';
import styled from 'styled-components';
import LabeledCheckbox from './LabeledCheckbox';
import DebugPanel from './DebugPanel';
import SelectionOutputs from './SelectionOutputs'
import DividerRect from './DividerRect'
import LabeledInput from './LabeledInput'
import {evalScript} from './evalScript'
import { FolderOpen } from '@styled-icons/boxicons-solid';
import { openUrl } from './openUrl';

const Settings = ({deleteTempsToggle,setDeleteTempsToggle,debugMessage,accelThreshold,setAccelThreshold,useDebugMessage,setUseDebugMessage,outputTemplates,setOutputTemplates,selectedOutput,setSelectedOutput,ffmpegPath,setFfmpegPath,ffeditPath,setFfeditPath,ffgacPath,setFfgacPath,OStype}) => {
    
    const checkboxHandler = (e) => {
        var checkboxType = e.target.id;
        if(checkboxType == "deleteTempFiles"){
            setDeleteTempsToggle(!deleteTempsToggle)
        }
        if(checkboxType == "accelThreshold"){
            setAccelThreshold(!accelThreshold)
        }
        if(checkboxType == "useDebugMessage"){
            setUseDebugMessage(!useDebugMessage)
        }
    }

    const inputHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        if(inputType =='ffmpegPath')setFfmpegPath(inputValue);
        if(inputType =='ffeditPath')setFfeditPath(inputValue);
        if(inputType =='ffgacPath')setFfgacPath(inputValue);
    }

    const dialogHandlerFFmpeg = (e) => {
        const fs = require('fs');
        const pathModule = require('path');
        var initPath = false;
        var dirPath = pathModule.dirname(ffmpegPath);
        if(fs.existsSync(dirPath)){
            initPath = dirPath;
        }
        evalScript('openDialog', {name: 'ffmpeg',initPath: initPath}).then(json => {
            var data = JSON.parse(json);
            var path = data.returnPath;
            if(path){
                var normalPath = pathModule.normalize(path);
                var resolvePath = pathModule.resolve(normalPath);
                setFfmpegPath(resolvePath);
            }
        })
    }
    const dialogHandlerFFedit = (e) => {
        const fs = require('fs');
        const pathModule = require('path');
        var initPath = false;
        var dirPath = pathModule.dirname(ffeditPath);
        if(fs.existsSync(dirPath)){
            initPath = dirPath;
        }
        evalScript('openDialog', {name: 'ffedit',initPath: initPath}).then(json => {
            var data = JSON.parse(json);
            var path = data.returnPath;
            if(path){
                var normalPath = pathModule.normalize(path);
                var resolvePath = pathModule.resolve(normalPath);
                setFfeditPath(resolvePath);
            }
        })
    }
    const dialogHandlerFFgac = (e) => {
        const fs = require('fs');
        const pathModule = require('path');
        var initPath = false;
        var dirPath = pathModule.dirname(ffgacPath);
        if(fs.existsSync(dirPath)){
            initPath = dirPath;
        }
        evalScript('openDialog', {name: 'ffgac',initPath: initPath}).then(json => {
            var data = JSON.parse(json);
            var path = data.returnPath;
            if(path){
                var normalPath = pathModule.normalize(path);
                var resolvePath = pathModule.resolve(normalPath);
                setFfgacPath(resolvePath);
            }
        })
    }

    return(
        <SettingsContainerDiv>
            <TopSettingsDiv>
                <LabeledCheckbox
                    id={"deleteTempFiles"}
                    label={"Delete temps"}
                    checked={deleteTempsToggle}
                    onChange={checkboxHandler}
                    isVisible={true}
                />
                <LabeledCheckbox
                    id={"accelThreshold"}
                    label={"Accelerate threshold"}
                    checked={accelThreshold}
                    onChange={checkboxHandler}
                    isVisible={true}
                />
                <DividerRect isVisible={true}/>
                <SelectionContainer>
                    <HeaderDiv>Output Template</HeaderDiv>
                    <SelectionOutputs
                        outputTemplates = {outputTemplates}
                        setOutputTemplates = {setOutputTemplates}
                        selectedOutput ={selectedOutput}
                        setSelectedOutput = {setSelectedOutput}
                    />
                </SelectionContainer>
                <DividerRect isVisible={true}/>
                <PathSelectionDiv>
                    <LabeledInput
                        id={"ffmpegPath"}
                        label="FFmpeg Path"
                        value={ffmpegPath}
                        onChange={inputHandler}
                        isVisible={true}
                        inputWidth= {'50%'}
                    />
                    <IconButtonDiv onClick={dialogHandlerFFmpeg}> <StyledFolder/> </IconButtonDiv>
                </PathSelectionDiv>
                <PathSelectionDiv>
                    <LabeledInput
                        id={"ffeditPath"}
                        label="FFedit Path"
                        value={ffeditPath}
                        onChange={inputHandler}
                        isVisible={true}
                        inputWidth= {'50%'}
                    />
                    <IconButtonDiv onClick={dialogHandlerFFedit}> <StyledFolder/> </IconButtonDiv>
                </PathSelectionDiv>
                <PathSelectionDiv>
                    <LabeledInput
                        id={"ffgacPath"}
                        label="FFgac Path"
                        value={ffgacPath}
                        onChange={inputHandler}
                        isVisible={true}
                        inputWidth= {'50%'}
                    />
                    <IconButtonDiv onClick={dialogHandlerFFgac}> <StyledFolder/> </IconButtonDiv>
                </PathSelectionDiv>
                <PathHelpDiv isVisible={OStype.current == 'WIN'}>
                    <StyledParagraph>Paths not working? <StyledLinkSetting href="https://youtu.be/87JzRcKHuC8" target="_blank" onClick={openUrl}>Install the externals manually.</StyledLinkSetting> </StyledParagraph>
                </PathHelpDiv>
                <PathHelpDiv isVisible={OStype.current == 'MAC'}>
                    <StyledParagraph>Paths not working? <StyledLinkSetting href="https://youtu.be/BSfKCwWXBb0" target="_blank" onClick={openUrl}>Install the externals manually.</StyledLinkSetting> </StyledParagraph>
                </PathHelpDiv>
                <DividerRect isVisible={true}/>
                <LabeledCheckbox
                    id={"useDebugMessage"}
                    label={"Use Debug Message"}
                    checked={useDebugMessage}
                    onChange={checkboxHandler}
                    isVisible={true}
                /> 
            </TopSettingsDiv>
            <DebugPanel debugMessage = {debugMessage} useDebugMessage = {useDebugMessage}/>
        </SettingsContainerDiv>
    )
}

const SettingsContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.ae.panelBackgroundColor};
`
const TopSettingsDiv = styled.div`
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 10px 3px 10px;
`
const SelectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
`
const HeaderDiv = styled.div`
    margin: 3px 0px;
    color:  ${props => props.theme.text.mid};
    font-size: 10pt;
    display: flex;
`
const PathSelectionDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items:center;
    color:${props => props.theme.text.mid}
`
const PathHelpDiv = styled.div`
    display: ${props => props.isVisible ? 'flex' : 'none'};
    flex-direction: row;
    align-items:center;
    justify-content: flex-end;
    height: 31px;
    font-size: 12px;
    margin-top: -5px;
`
const IconButtonDiv = styled.button`
    min-width: 29px;
    width: 33px;
    height: 33px;
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
const StyledFolder = styled(FolderOpen)`
    height:15px;
    width:15px;
`
const StyledParagraph = styled.p`
    color: ${props => props.theme.text.mid};
`
const StyledLinkSetting = styled.a`
  color: ${props => props.theme.ae.systemHighlightColor};
`


export default Settings