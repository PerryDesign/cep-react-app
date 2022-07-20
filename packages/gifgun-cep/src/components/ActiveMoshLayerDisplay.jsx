import React from 'react';
import styled from 'styled-components';

const ActiveMoshLayerDisplay = ({activeLayerKey}) => {
    return(
        <ActiveMoshLayerDiv>Active Layer : {activeLayerKey}</ActiveMoshLayerDiv>
    )
}

const ActiveMoshLayerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

export default ActiveMoshLayerDisplay;