import React from 'react'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react';

const ScrollbarContainer = (props) => {

    // Set window height
    const [windowHeight, setWindowHeight] = useState(400);
    const [rulerHeight, setRulerHeight] = useState(300);
    if(windowHeight != parent.window.innerHeight && parent.window.innerHeight != 0){
        console.log('The window height state is  '+windowHeight);
        console.log('The parent window inner height'+parent.window.innerHeight);
        setWindowHeight(parent.window.innerHeight)
    }
    
    var heightCalcString = `calc(100vh - ${props.minusHeight}px)`;

    // // Get ruler height
    // var rulerDivName = 'scrollbar_ruler_'+props.type;
    // useEffect(()=>{
    //     const rulerDocHeight = document.querySelector(`#${rulerDivName}`).offsetHeight;
    //     console.log('The ruler height for'+rulerDivName+rulerDocHeight);
    //     setRulerHeight(rulerDocHeight)
    // },[windowHeight])
    
    
    
    return(

            <ScrollbarDiv rulerHeight={rulerHeight} heightCalcString={heightCalcString}>
                {props.children}
            </ScrollbarDiv>
    )

}
const ScrollbarContainerDiv = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
`

const ScrollbarDiv = styled.div`
    height: ${props => props.heightCalcString};
    display: flex;
    flex-direction: column;
    width: -webkit-fill-available;
    overflow-y: auto;
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
export default ScrollbarContainer;