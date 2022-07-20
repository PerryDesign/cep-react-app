import React from "react";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trash } from "@styled-icons/fa-solid";
import { DownArrow } from "@styled-icons/boxicons-solid";
import validator from "validator";

import LabeledCheckbox from "./LabeledCheckbox";
import LabeledInput from "./LabeledInput";
import Selection from "./Selection";
import DividerRect from "./DividerRect";
import presets from "./presets";
import { createKey } from "./createKey.jsx";
import { createNotification } from "./createNotification";
import { activeCompHandler } from "./activeCompHandler.jsx";
import { IconButton } from "@material-ui/core";
import { devMode } from "../DevMode";

const MoshModule = ({
    isTrial,
    moshModules,
    setMoshModules,
    moshModule,
    activeItemComp,
}) => {
    // State
    const [dropDown, setDropDown] = useState(false);
    const [presetOpen, setPresetOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState({
        label: moshModule.preset.label,
        value: moshModule.preset.value,
        type: moshModule.preset.type,
    });
    const previousPreset = useRef({
        label: moshModule.preset.label,
        value: moshModule.preset.value,
        type: moshModule.preset.type,
    });

    useEffect(() => {
        console.log("The preset is " + selectedPreset.label);
        // Check Active Comp
        if (activeCompHandler(activeItemComp.current)) {
            if (previousPreset.current.label != selectedPreset.label) {
                selectionTrialRestraint();
            }
            // If no comp
        } else {
            console.log("No active Comp");
            setSelectedPreset(previousPreset.current);
        }

        // Goes through preset types and will ont set certain if on trial
        function selectionTrialRestraint() {
            if (isTrial) {
                if (
                    selectedPreset.type != "default" &&
                    selectedPreset.type != "zoom"
                ) {
                    createNotification(
                        "trial error",
                        "This feature is only available with the full version of Datamosh 2. Please support the creators and upgrade below :)"
                    );
                    setSelectedPreset(previousPreset.current);
                } else {
                    previousPreset.current = selectedPreset;
                    if (selectedPreset.value != moshModule.preset.value) selectionHandler();
                }
            } else {
                previousPreset.current = selectedPreset;
                if (selectedPreset.value != moshModule.preset.value) selectionHandler();
            }
        }
    }, [selectedPreset]);

    useEffect(() => {
        if (moshModule.preset.label != selectedPreset.label) {
            console.log("The current preset is " + selectedPreset.label + " and the moshModule is " + moshModule.preset.label);
            setSelectedPreset({
                label: moshModule.preset.label,
                value: moshModule.preset.value,
            });
        }
    }, [moshModules]);

    // Functions
    const deleteHandler = () => {
        if (activeCompHandler(activeItemComp.current)) {
            setMoshModules(
                moshModules.filter((el) => el.key !== moshModule.key)
            );
        }
    };
    const dropDownHandler = () => {
        setDropDown(!dropDown);
    };
    const checkboxHandler = (e) => {
        var checkboxType = e.target.id;
        if (activeCompHandler(activeItemComp.current)) {
            setMoshModules(
                moshModules.map((module) => {
                    if (module.key === moshModule.key) {
                        return {
                            ...module,
                            updateKey: createKey("Checkbox Handler Update"),
                            moshData: {
                                ...module.moshData,
                                holdFrames:
                                    checkboxType == "holdFrames"
                                        ? !module.moshData.holdFrames
                                        : module.moshData.holdFrames,
                                injectFrames:
                                    checkboxType == "injectFrames"
                                        ? !module.moshData.injectFrames
                                        : module.moshData.injectFrames,
                                useMap:
                                    checkboxType == "useMap"
                                        ? !module.moshData.useMap
                                        : module.moshData.useMap,
                            },
                        };
                    }
                    return module;
                })
            );
        }
    };
    const inputHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        if (isTrial) {
            if (inputType == "blend" || inputType == "threshold") {
                createNotification(
                    "trial error",
                    " This feature is only available with the full version of Datamosh 2. Please support the creators and upgrade below :)"
                );
            } else setModulesInput();
        } else {
            setModulesInput();
        }

        function setModulesInput() {
            if (
                activeCompHandler(activeItemComp.current) &&
                e.target.value != "-"
                    ? e.target.value != ""
                        ? validator.isInt(inputValue)
                        : true
                    : true
            ) {
                setMoshModules(
                    moshModules.map((module) => {
                        if (module.key === moshModule.key) {
                            console.log("Found Key");
                            return {
                                ...module,
                                updateKey: createKey("Input Handler Update"),
                                moshData: {
                                    ...module.moshData,
                                    repeatFrames:
                                        inputType == "repeatFrames"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.repeatFrames,
                                    intensity:
                                        inputType == "intensity"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.intensity,
                                    acceleration:
                                        inputType == "acceleration"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.acceleration,
                                    blend:
                                        inputType == "blend"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.blend,
                                    threshold:
                                        inputType == "threshold"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.threshold,
                                    swapWI:
                                        inputType == "swapWI"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.swapWI,
                                    swapFI:
                                        inputType == "swapFI"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.swapFI,
                                    swapFO:
                                        inputType == "swapFO"
                                            ? inputValue != "-" &&
                                              inputValue != ""
                                                ? Math.max(
                                                      Math.min(
                                                          inputValue,
                                                          1000
                                                      ),
                                                      -1000
                                                  )
                                                : inputValue
                                            : module.moshData.swapFO,
                                },
                            };
                        }
                        return module;
                    })
                );
            }
        }
    };
    const presetHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        if (activeCompHandler(activeItemComp.current)) {
            setMoshModules(
                moshModules.map((module) => {
                    if (module.key === moshModule.key) {
                        console.log("Found Key");
                        return {
                            ...module,
                            updateKey: createKey("Input Handler Update"),
                            preset: {
                                ...module.preset,
                                mv0:
                                    inputType == "presetValue0"
                                        ? inputValue
                                        : module.preset.mv0,
                                mv1:
                                    inputType == "presetValue1"
                                        ? inputValue
                                        : module.preset.mv1,
                            },
                        };
                    }
                    return module;
                })
            );
        }
    };
    function selectionHandler() {
        setMoshModules(
            moshModules.map((module) => {
                if (module.key === moshModule.key) {
                    
                    return {
                        ...module,
                        updateKey: createKey("Selection Handler Update"),
                        preset: {
                            type: selectedPreset.type, // Failing here!
                            value: selectedPreset.value,
                            label: selectedPreset.label,
                            mv0: selectedPreset.mv0,
                            mv1: selectedPreset.mv1,
                        },
                        moshData:{
                            ...module.moshData,
                            useMap: selectedPreset.type === 'experimental' ? false : module.moshData.useMap,
                        }
                    };
                }
                return module;
            })
        );
    }

    // Render
    return (
        <MoshModuleContainer>
            <HighlightDiv>
                <IconButtonDiv onClick={dropDownHandler}>
                    {" "}
                    <StyledArrow dropDown={dropDown}></StyledArrow>{" "}
                </IconButtonDiv>
                <Selection
                    presetOpen={presetOpen}
                    setPresetOpen={setPresetOpen}
                    selectedPreset={selectedPreset}
                    setSelectedPreset={setSelectedPreset}
                    moshModules={moshModules}
                    moshModule={moshModule}
                    isTrial={isTrial}
                />
                <IconButtonDiv onClick={deleteHandler}>
                    {" "}
                    <StyledTrash></StyledTrash>{" "}
                </IconButtonDiv>
            </HighlightDiv>
            <HideableDiv dropDown={dropDown}>
                <TopModuleSettingsDiv
                    isVisible={moshModule.preset.type != "experimental"}
                >
                    <LabeledCheckbox
                        id={"holdFrames"}
                        label="Hold Frames"
                        checked={moshModule.moshData.holdFrames}
                        onChange={checkboxHandler}
                        isVisible={true}
                    />
                    <LabeledCheckbox
                        id={"injectFrames"}
                        label="Inject Frames"
                        checked={moshModule.moshData.injectFrames}
                        onChange={checkboxHandler}
                        isVisible={moshModule.moshData.holdFrames}
                    />
                    <LabeledInput
                        id={"repeatFrames"}
                        label="Repeat Frames"
                        value={moshModule.moshData.repeatFrames}
                        onChange={inputHandler}
                        isVisible={false}
                    />
                    <LabeledInput
                        id={"presetValue0"}
                        label="Preset Frames 0"
                        value={moshModule.preset.mv0}
                        onChange={presetHandler}
                        isVisible={devMode}
                        inputWidth={"50%"}
                    />
                    <LabeledInput
                        id={"presetValue1"}
                        label="Preset Frames 1"
                        value={moshModule.preset.mv1}
                        onChange={presetHandler}
                        isVisible={devMode}
                        inputWidth={"50%"}
                    />
                </TopModuleSettingsDiv>
                <TopModuleExperimentalSettingsDiv
                    isVisible={moshModule.preset.type == "experimental"}
                >
                    <ActiveSwapLayerDiv>
                        Swap Layer : {moshModule.key}
                    </ActiveSwapLayerDiv>
                    <LabeledInput
                        id={"swapWI"}
                        label="Blend"
                        value={moshModule.moshData.swapWI}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"swapFI"}
                        label="Fade In"
                        value={moshModule.moshData.swapFI}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"swapFO"}
                        label="Fade Out"
                        value={moshModule.moshData.swapFO}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"presetValue0"}
                        label="Preset Frames 0"
                        value={moshModule.preset.mv0}
                        onChange={presetHandler}
                        isVisible={devMode}
                        inputWidth={"50%"}
                    />
                    <LabeledInput
                        id={"presetValue1"}
                        label="Preset Frames 1"
                        value={moshModule.preset.mv1}
                        onChange={presetHandler}
                        isVisible={devMode}
                        inputWidth={"50%"}
                    />
                </TopModuleExperimentalSettingsDiv>
                <DividerRect isVisible={true}></DividerRect>
                <BottomModuleSettingsDiv
                    isVisible={moshModule.preset.type != "experimental"}
                >
                    <LabeledInput
                        id={"intensity"}
                        label="Intensity"
                        value={moshModule.moshData.intensity}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"acceleration"}
                        label="Acceleration"
                        value={moshModule.moshData.acceleration}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"blend"}
                        label="Blend"
                        value={moshModule.moshData.blend}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"threshold"}
                        label="Threshold"
                        value={moshModule.moshData.threshold}
                        onChange={inputHandler}
                        isVisible={true}
                    />
                    <LabeledInput
                        id={"duration"}
                        label="Duration"
                        value={moshModule.moshData.duration}
                        onChange={inputHandler}
                        isVisible={false}
                    />
                    <LabeledInput
                        id={"interval"}
                        label="Interval"
                        value={moshModule.moshData.interval}
                        onChange={inputHandler}
                        isVisible={false}
                    />
                </BottomModuleSettingsDiv>
                <DividerRect isVisible={moshModule.preset.type != "experimental"}></DividerRect>
                <MapSettingsDiv isVisible={moshModule.preset.type != "experimental"}>
                    <LabeledCheckbox
                        id={"useMap"}
                        label="Use Map"
                        checked={moshModule.moshData.useMap ? true : false}
                        onChange={checkboxHandler}
                        isVisible={true}
                    />
                </MapSettingsDiv>
            </HideableDiv>
        </MoshModuleContainer>
    );
};

// Theme
const MoshModuleContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
`;
const HighlightDiv = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;
const HideableDiv = styled.div`
    display: ${(props) => (props.dropDown ? "flex" : "none")};
    flex-direction: column;
    width: 100%;
    margin: 5px 0px 5px 0px;
`;
const TopModuleSettingsDiv = styled.div`
    display: ${(props) => (props.isVisible ? "flex" : "none")};
    flex-direction: column;
    margin: 5px 0px 0px 0px;
`;
const TopModuleExperimentalSettingsDiv = styled.div`
    display: ${(props) => (props.isVisible ? "flex" : "none")};
    flex-direction: column;
    margin: 5px 0px 0px 0px;
`;
const BottomModuleSettingsDiv = styled.div`
    display: ${(props) => (props.isVisible ? "grid" : "none")};
    grid-template-columns: 1fr 1fr;
    column-gap: 10%;
`;
const MapSettingsDiv = styled.div`
    display: ${(props) => (props.isVisible ? "flex" : "none")};
    flex-direction: column;
    margin: 5px 0px 0px 0px;
`;
const IndicatorRect = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: blue;
    width: 5px;
    margin-left: 5px;
    margin-right: 5px;
`;
const ActiveSwapLayerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const IconButtonDiv = styled.button`
    min-width: 29px;
    width: 33px;
    height: 33px;
    color: white;
    background-color: ${(props) => props.theme.ae.panelBackgroundColor};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline: 0;
    }
    :hover {
        background-color: ${(props) => props.theme.background.dark};
    }
`;
const StyledTrash = styled(Trash)`
    height: 15px;
    width: 15px;
`;
const StyledArrow = styled(DownArrow)`
    height: 15px;
    width: 15px;
    transform: ${(props) => (props.dropDown ? "rotate(0)" : "rotate(-90deg)")};
`;

export default MoshModule;
