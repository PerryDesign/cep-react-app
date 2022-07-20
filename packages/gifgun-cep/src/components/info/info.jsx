import React from 'react';
import styled from 'styled-components';
import ScrollbarContainer from '../ScrollbarContainer'
import {Instagram} from '@styled-icons/bootstrap'
import {ShoppingCart} from '@styled-icons/evaicons-solid'
import { openUrl } from '../openUrl'
import { openUrl_button } from '../openUrl_button'
const {version} = require('../../appVersion');


const Info = (props) => {
    const LinkButtonHandlerInsta = (e) => {
        console.log(e.target.id);
        openUrl_button('https://www.instagram.com/datamosh/');
    }
    const LinkButtonHandlerShop = (e) => {
        console.log(e.target.id);
        openUrl_button('https://aescripts.com/authors/m-p/plugin-play/');
    }
    const LinkButtonHandlerSupport = (e) => {
        console.log(e.target.id);
        openUrl_button('https://aescripts.com/support/');
    }
    const ButtonHandlerTutorial = (e) => {
        var cs = new CSInterface();
        cs.requestOpenExtension('com.aescripts.datamosh2.settings')
    }

    return(
        
        <InfoContainerDiv>
            <ImageDiv>
                <ImageContainer src={'assets/logo/D2_full_Alpha_600px.png'}/>
                <VersionInfoDiv>
                    <p>Version {version}</p>
                </VersionInfoDiv>
            </ImageDiv>
            <ButtonDiv>
                <InfoButton onClick={ButtonHandlerTutorial}>Tutorial</InfoButton>
                <InfoButton onClick={LinkButtonHandlerSupport}>Support</InfoButton>
                <InfoButton onClick={LinkButtonHandlerInsta} href={"https://www.instagram.com/datamosh/"} target="_blank"> <StyledInsta/> </InfoButton>
                <InfoButton onClick={LinkButtonHandlerShop}><StyledShop/> </InfoButton>
            </ButtonDiv>
            <ScrollbarContainer minusHeight={(110+63+50+15)} type={'info'} >
                <MidInfoContainer>
                    <p>Datamosh 2 is a result of the culmination of many artists and developers from around the world. It aims to open new doors for glitch enthusiasts looking to further the granualrity of their experiments. Who am I kidding? It’s really here to punish those naughty pixels. </p>
                    <p>Made possible by the following:</p>
                    <p>FFglitch by Ramiro Polla - <StyledLink href="https://www.ffglitch.org/" target="_blank" onClick={openUrl}>Website</StyledLink></p>
                    <p>FFmpeg - <StyledLink href="https://www.ffmpeg.org/" target="_blank" onClick={openUrl}>Website</StyledLink></p>
                </MidInfoContainer>
            </ScrollbarContainer>
            <BottomInfoDiv>
                <p>Made with ❤ in Chicago, IL and Lexington, KY.</p>
            </BottomInfoDiv>
        </InfoContainerDiv>
    )
}

const InfoContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: center;
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    height: 100%;
    // justify-content: space-around;
    align-items: center;
    padding: 0px 10px
`
const ImageDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 10px 0px 0px;
    max-width: 230px;
`
const ButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin: 10px 0px 20px 0px;
    justify-content: center;
    width: 60vw;
`
const MidInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    // align-items: center;
    padding: 10px 10px 0px;
    background-color: ${props => props.theme.background.darker};
`
const BottomInfoDiv = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0px;
    justify-content: center;
    margin: 10px 0px;
    height: 30px;
    color: ${props => props.theme.text.mid};
`
const VersionInfoDiv = styled.div`
    height: 20px;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${props => props.theme.text.mid};
`
const ImageContainer = styled.img`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: 100%;
`
const InfoButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    margin: 0px 5px;
    height: 33px;
    color: white;
    background-color: ${props => props.theme.background.light};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.background.dark};
    }
`

const StyledInsta = styled(Instagram)`
    height:15px;
    width:15px;
`
const StyledShop = styled(ShoppingCart)`
    height:15px;
    width:15px;
`
const StyledLink = styled.a`
  color: ${props => props.theme.ae.systemHighlightColor};
`

export default Info