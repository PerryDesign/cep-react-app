import React from 'react';
import styled from 'styled-components';
import Tutorial from './components/intro/Tutorial'

const App_Intro = ({OStype,scriptPath,tmpDirPath}) => {

    return (
        <TutorialDiv visible={true}>
            <Tutorial
                OStype = {OStype}
                scriptPath = {scriptPath}
                tmpDirPath={tmpDirPath}
            />
        </TutorialDiv>
    )
}

const TutorialDiv = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.ae.panelBackgroundColor}
`

export default App_Intro 