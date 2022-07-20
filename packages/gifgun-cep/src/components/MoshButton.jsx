import React from 'react';
import styled from 'styled-components'
import {activeCompHandler} from './activeCompHandler.jsx'
import LabeledCheckbox from './LabeledCheckbox'


const MoshButton = ({isRendering, setIsRendering,activeItemComp,usePrevRend,setUsePrevRend,showUsePrevRend,activeLayerKey,previousPrimeKey}) => {

    const checkboxHandler = (e) => {
        if(activeCompHandler(activeItemComp.current)){
            var checkboxType = e.target.id;
            if(checkboxType == "usePrevRen") setUsePrevRend(!usePrevRend)
        }
    }

    const moshClickHandler = (e) => {
        if(activeCompHandler(activeItemComp.current)){
            setIsRendering(true)
            // console.log(isRendering)
        }
    }
    return(
        <BottomHomeDiv isRendering={isRendering}>
            <UsePrevRenDiv showUsePrevRend={showUsePrevRend && previousPrimeKey.current == activeLayerKey}>
                <LabeledCheckbox
                id={"usePrevRen"}
                label="Use previous render"
                checked={usePrevRend}
                onChange={checkboxHandler}
                isVisible={showUsePrevRend}
                />
            </UsePrevRenDiv>
            <ButtonDiv onClick={moshClickHandler}>
                <ImgDivs/>
            </ButtonDiv>
        </BottomHomeDiv>
    )
    
}
const BottomHomeDiv = styled.div`
    display: ${props => props.isRendering ? 'none' : 'flex'};
    flex-direction: column;
    width: 100%;
    z-index: 1;
    box-shadow: 0px 0px 5px black;
    margin: 0px 0px 0px 0px;
    background-color: ${props => props.theme.ae.panelBackgroundColor};
`
const UsePrevRenDiv = styled.div`
    display: ${props => props.showUsePrevRend ? 'flex' : 'none'};;
    flex-direction: column;
    width: auto;
    margin: 5px 10px 5px 10px;
`
const ButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
    height: 70px;
    justify-content: center;
    align-items: center;
    &:hover{
        background-color: ${props => props.theme.colors.purple};
    };
`
const ImgDivs = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: url(assets/logo/UILogo_Glitch.png)no-repeat center center;
    background-size: 170px;
    &:hover{
        background: url(assets/logo/UILogo_Glitch.png)no-repeat center center;
        background-size: 200px;
    };
`

export default MoshButton