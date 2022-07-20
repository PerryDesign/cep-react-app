import React from 'react';
import styled from 'styled-components';

const DebugPanel = ({debugMessage,useDebugMessage}) => {
    // Return
    return(
        <DebugPanelDiv debugMessage = {debugMessage} useDebugMessage={useDebugMessage}>
            <HeaderDiv>
                Debug Log
            </HeaderDiv>
            <ScrollBar>
            {debugMessage.map(chunk => {
                return (
                <DebugTextBox>
                    <DividerRect2/>
                    {chunk};
                </DebugTextBox>
                )
            })}
            </ScrollBar>
        </DebugPanelDiv>
    )

};

const DebugPanelDiv = styled.div`
    width: -webkit-fill-available;
    padding: 5px 10px;
    display: ${props => props.useDebugMessage ? 'flex' : 'none'};
    flex-direction: column;
    height: 100%;
`

const HeaderDiv = styled.div`
    margin: 0px 10px;
    color:  ${props => props.theme.text.mid};
    font-size: 10pt;
    display: flex;
`

const ScrollBar = styled(DebugPanelDiv)`
    overflow-y: scroll;
    display: flex;
    height: 350px;
    margin: 5px 0px;
    background-color: ${props => props.theme.background.darker};
    &::-webkit-scrollbar {
        width: 10px;
        height: 0px;
    };
    &::-webkit-scrollbar-track {
        background-color: ${props => props.theme.background.dark};
    };
    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.ae.panelBackgroundColor};
    };
    &::-webkit-scrollbar-corner {
        background-color: ${props => props.theme.background.dark};
    };
     

`
const DebugTextBox = styled.div`
    color:  ${props => props.theme.text.bright};
    display: flex;
    flex-direction: column;
    margin-top: 3px;
    font-size: 8pt;
`
const DividerRect2 = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${props => props.theme.background.dark};
    display: flex;
`



export default DebugPanel