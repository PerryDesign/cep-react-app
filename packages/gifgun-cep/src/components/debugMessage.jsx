import React from 'react';

const DebugPanel = ({debugMessage}) => {

    // Return
    return(
        <DebugPanelDiv>
            {debugMessage}
        </DebugPanelDiv>
    )

};

const DebugPanelDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.theme.background.darker};
    margin: 5px 5px;
    padding: 5px 5px;
`


export default DebugPanel