import React from 'react';
import styled from 'styled-components';

import Hideable from "./Hideable";


const Active = ({activeTabIndex ,tabs}) => {

    function tabContentFactory(tab, index, active, title) {
        var comp = tab.comp
        return (
            <Hideable key={index} visible={active} title={title} comp={comp}/>
        )
    }

    // Render
    return(
        <ActiveDiv>
            {tabs.map((tab,i) => tabContentFactory(tab, i, activeTabIndex===i, tab.title))}
        </ActiveDiv>
    )
}

// Theme

const ActiveDiv = styled.div`
    display: inline-block;
    background-color: ${props => props.theme.background.dark};
    height: 100%;
    width: 100%;
    min-width: 250px;
`

export default Active;