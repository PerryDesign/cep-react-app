import React, { useEffect, useState, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { darken, lighten } from 'polished'
import colorConvert from 'color-convert'
import ReactNotifications from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
const {version} = require('../appVersion');

import {createKey} from './createKey'
import Panels from './PanelList'



const PanelContainer = () => {

    // Globals
    const OStype = useRef("");
    const scriptPath = useRef("");
    const tmpDirPath = useRef("");

    // License
    const [isTrial, setIsTrial] = useState(true);
    const A = require("exports-loader?Aesp!../licensing/aesp.js");
    function callbackForLicense(isValidLicense, isTrialReturn) {
        setIsTrial(isTrialReturn)
    };
    // THIS IS LICENCE!
    const a =
        new A(
            {
                productVersion: version,
                betaMode: false,
                betaExpirationDate: new Date("Sep 10,2021")
            },
            callbackForLicense
        );

    // This is a patch for adobe require where require("./<path>") will not resoleve to full path
    // The solution is to instead fallback to require("<path>") but this file needs to be placed in node_modules
    (function () {
        if (window.require) {
            window.oldRequire = window.require;
            window.require = function (path, ...rest) {
                if (path && path[0] === "." && path[1] === "/") {
                    return window.oldRequire(path.slice(2), ...rest);
                } else {
                    return window.oldRequire(path, ...rest);
                }
            };
        }
    })();

    // Check which type of panel
    const [retrievedPanel, setRetrievedPanel] = useState(false);
    const [panelToRender, setPanelToRender] = useState('App_Intro');
    getExtensionType().then((res)=>{
        setRetrievedPanel(true);
        setPanelToRender(res);
    })
    function getExtensionType () {
        return new Promise((resolve,reject) => {
            var cs = new CSInterface();
            var ID = cs.getExtensionID()
            console.log(ID);
            if(ID == 'com.aescripts.datamosh2.settings'){
                resolve('App_Intro');
            }else{
                resolve('App');
            }           
        })
    };
    const ComponentToRender = Panels[panelToRender];


    // ON MOUNT
    useEffect(()=>{
        scriptPath.current = getScriptPath();
        tmpDirPath.current = getTmpDirPath()
    },[])

    function getTmpDirPath(){
        var os = require('os')
        var path = require('path')
        var tmpDirRootPath = os.tmpdir();
        var tmpFFmpegPath = path.join(tmpDirRootPath,"Datamosh2",OStype.current);
        return(tmpFFmpegPath);
    }


    function getScriptPath(){
        var path;
        path = location.href;
        if(getOS() == "MAC"){
            OStype.current = "MAC";
            path = path.replace(/%20/g, " ");
            path = path.substring(7, path.length - 11);
        }else{
            path = path.substring(8, path.length - 11);
            path = path.replace(/\\/g,"/")
            OStype.current = "WIN";
        };
        path = __dirname;
        return path;
    };
    function getOS(){
        var userAgent = window.navigator.userAgent
        var platform = window.navigator.platform
        var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
        var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
        var os = null;
    
        if(macosPlatforms.indexOf(platform) != -1) {
            os = "MAC";
        } else if(windowsPlatforms.indexOf(platform) != -1) {
            os = "WIN";
        }
        return os;
    };

    // Theme
    var getThemeInformation = (function(){
        var csInterface = new CSInterface();
        
        const convertColorObject = (colorObj) => {
            return '#' + colorConvert.rgb.hex(colorObj.red, colorObj.green, colorObj.blue)
            }
        const createMockColor = (red, green, blue) => {
            return { red, green, blue }
        }
        const getAppSkinInfo = () => {
            if (csInterface.hostEnvironment) {
                return csInterface.hostEnvironment.appSkinInfo
            } else {
                return {
                panelBackgroundColor: {
                    color: createMockColor(38.25, 38.25, 38.25)
                },
                baseFontFamily: 'Adobe Clean',
                appBarBackgroundColor: {
                    color: createMockColor(38.25, 38.25, 38.25)
                },
                baseFontSize: 9,
                systemHighlightColor: createMockColor(0, 120, 215)
                }
            }
        }
        const themeInformation = getAppSkinInfo();
        var ae =  {
            baseFontSize: themeInformation.baseFontSize,
            baseFontFamily: themeInformation.baseFontFamily,
            systemHighlightColor: convertColorObject(themeInformation.systemHighlightColor),
            appBarBackgroundColor: convertColorObject(themeInformation.appBarBackgroundColor.color),
            panelBackgroundColor: convertColorObject(themeInformation.panelBackgroundColor.color)
        }
        ae.systemHighlightColor = '#0078d7' // We have to hard-code this because Windows gets the wrong color.
        return {
            ae,
            background: {
            lighter: lighten(0.2, ae.panelBackgroundColor),
            light: lighten(0.1, ae.panelBackgroundColor),
            dark: darken(0.05, ae.panelBackgroundColor),
            darker: darken(0.1, ae.panelBackgroundColor)
            },
            text: {
                highlight: 'white',
                bright: '#c3c4c6',
                mid: '#939598',
                dark: darken(0.05,'#939598'),
            },
            colors: {
                green: '#23EB87',
                red: '#eb093f',
                blue: ae.systemHighlightColor,
                purple: '#8A2BE2',
                text: '#939598'
            }
        }
    })();

    return(
        <ThemeProvider theme={getThemeInformation}>
            <PanelLiveDiv retrievedPanel={retrievedPanel}>
                <ReactNotifications />
                <ComponentToRender 
                    OStype = {OStype}
                    scriptPath = {scriptPath}
                    isTrial = {isTrial}
                    tmpDirPath = {tmpDirPath}
                />
            </PanelLiveDiv>
        </ThemeProvider>
    )
}


// STYLING
const PanelLiveDiv = styled.div`
    display: ${props => props.retrievedPanel ? 'flex' : 'none'};
    flex-direciton: column;
    font-family: "${props => props.theme.ae.baseFontFamily}", "Segoe UI", "San Francisco", sans-serif;
    font-size: ${props => props.theme.ae.baseFontSize}pt;
    color: white;
`
const PanelLoadingDiv = styled.div`
    display: ${props => props.retrievedPanel ? 'none' : 'flex'};
    flex-direciton: column;
`



export default PanelContainer 

