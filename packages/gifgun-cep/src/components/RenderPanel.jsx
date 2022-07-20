import React from 'react'
import styled from 'styled-components'
import ProgressBar from './ProgressBar'
import {CloseCircle} from '@styled-icons/remix-line'
import {activeCompHandler} from './activeCompHandler.jsx'


const RenderPanel = ({percentDone,moshStepNum,moshStepTotal,exportingMoshPhase,setExportingMoshPhase}) => {

    const exitHandler = () => {
        setExportingMoshPhase('deleteTempFiles');
    };

    return(
        <RenderContainerDiv>
            <IconWholeDiv>
                <IconButtonCloseDiv onClick={exitHandler}> <StyledClose></StyledClose> </IconButtonCloseDiv>
            </IconWholeDiv>
            <HeadlineDiv>
                Moshing
            </HeadlineDiv>
            <PhaseAndBarDiv>
                <Phase>
                    Phase: {exportingMoshPhase}
                </Phase>
                <ProgressBar percentage={Math.round(percentDone*100)} isComplete={percentDone >= .95 ? true:false}/>
                <LessPhase>
                   {Math.round(percentDone*100)} %
                </LessPhase>
            </PhaseAndBarDiv>
        </RenderContainerDiv>
    )

}  

const RenderContainerDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px 0px 10px 0px;
    color: ${props => props.theme.background.lighter};
    background-color: ${props => props.theme.ae.panelBackgroundColor};
`
const PhaseAndBarDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    max-width: 80%;
`
const HeadlineDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "${props => props.theme.ae.baseFontFamily}", "Segoe UI", "San Francisco", sans-serif;
    font-size: ${props => props.theme.ae.baseFontSize*2}pt;
    font-weight: 700;
    color: ${props => props.theme.colors.purple};
    margin-bottom: 20px
`
const Phase = styled(RenderContainerDiv)`
    align-items: baseline;
    display: flex;
    font-family: "${props => props.theme.ae.baseFontFamily}", "Segoe UI", "San Francisco", sans-serif;
    font-size: ${props => props.theme.ae.baseFontSize}pt;
    color: ${props => props.theme.text.bright};
`
const LessPhase = styled(Phase)`
    margin-top: -10px;
    color: ${props => props.theme.text.mid};
`
const IconWholeDiv = styled.div`
    width: 100%;
    align-items: flex-end;
    display: flex;
    flex-direction: column;
`
const IconButtonCloseDiv = styled.button`
    margin: 5px;
    width: 33px;
    height: 33px;
    border-radius: 4px;
    border-style: none;
    color: ${props => props.theme.text.highlight};
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.background.dark};
    }
`
const StyledClose = styled(CloseCircle)`
    height:15px;
    width:15px;
`

export default RenderPanel