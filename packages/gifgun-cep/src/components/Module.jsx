import React from 'react'
import styled from 'styled-components'

const Module = ({comp}) => {
    return(
        <ModuleContainerDiv>
            {comp}
        </ModuleContainerDiv>
    )
}

const ModuleContainerDiv = styled.div`
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    display: flex;
    flex-direction: column;
    box-sizing:border-box;
    align-items: center;
    width: 100%;
    margin: 3px 0px 3px 0px;
    padding: 10px;
`

export default Module 