import React from 'react';
import styled from 'styled-components';
import {SwapVert, Settings} from '@styled-icons/material'
// import {InformationCircle} from '@styled-icons/heroicons-outline'
import {Info} from '@styled-icons/material-rounded'



const Navigator = ({activeTabIndex, setActiveTabIndex}) => {

    const tabHandler = (e) => {
        var val = parseInt(e.target.value);
        setActiveTabIndex(1);
        console.log(val);
    }
    const tabHandlerMosh = (e) => {
        var val = parseInt(e.target.value);
        setActiveTabIndex(0);
        console.log(val);
    }
    const tabHandlerInfo = (e) => {
        var val = parseInt(e.target.value);
        setActiveTabIndex(2);
        console.log(val);
    }

    // Render
    return(
        <NavigatorDiv>
            <NavigatorButton value={0} onClick={tabHandlerMosh} activeTabIndex={activeTabIndex}>
                <StyledSwap></StyledSwap>
            </NavigatorButton>
            <NavigatorButton value={1} onClick={tabHandler} activeTabIndex={activeTabIndex}>
                <StyledSettings></StyledSettings>
            </NavigatorButton>
            <NavigatorButton value={2} onClick={tabHandlerInfo} activeTabIndex={activeTabIndex}>
                <StyledInfo></StyledInfo>
            </NavigatorButton>
        </NavigatorDiv>
    )
}

// Theme
const NavigatorDiv = styled.div`
    z-index:2;
    margin-left: auto;
    margin-right: 0px;
    height: 100vh;
    background-color: ${props => props.theme.background.darker};
    display: flex;
    flex-direction: column;
`
const NavigatorButton = styled.button`
    width: 33px;
    height: 33px;
    color: white;
    background-color: ${props => props.activeTabIndex == props.value ? props.theme.ae.panelBackgroundColor : props.theme.background.darker};
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.activeTabIndex != props.value ? props.theme.background.dark : props.theme.ae.panelBackgroundColor};
    }
`
const StyledSwap = styled(SwapVert)`
    transform: rotate(45deg);
`
const StyledSettings = styled(Settings)`
    width: 80%;
`
const StyledInfo = styled(Info)`
    width: 80%;
`

export default Navigator