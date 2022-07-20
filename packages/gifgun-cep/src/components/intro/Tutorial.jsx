import React, { useState } from 'react'
import { TUTORIAL_STEPS } from './TutorialSteps'
import styled from 'styled-components'
import NextButton from './NextButton'
import PreviousButton from './PreviousButton'
import DownloadButton from './DownloadButton'
import RedownloadButton from './RedownloadButton'
import { closeExtension } from '../../libs/CSInterface'
import { resolve } from 'dns'
import {createNotification} from '../createNotification'
import {checkForFFmpeg} from '../checkForFFmpeg'


const Tutorial = ({OStype, scriptPath,tmpDirPath}) => {
  var path = require('path');
  var request = require('request');
  var fs = require('fs');
  var os = require('os');
  var dns = require('dns');
  const { spawn } = require('child_process');
  const zipbin = require('7zip-bin');
  // const { extractFull } = require('node-7z');
  require("tls").DEFAULT_ECDH_CURVE = "auto";

  const [currentStep, setCurrentStep] = useState(0);
  const [downloadStep, setDownloadStep] = useState('Ready');
  
  function _currentStep () { return TUTORIAL_STEPS[currentStep] }
  function _shouldShowNext ()  { return currentStep < TUTORIAL_STEPS.length - 1 }
  function _shouldShowFinal  () { return currentStep === TUTORIAL_STEPS.length - 1 }
  function _shouldShowPrevious () { return currentStep > 0 }
  function _shouldShowDownload () { return currentStep === 2 }


  // On clicks
  const onFinalButtonClicked = (e) => { 
    var cs = new CSInterface 
    cs.closeExtension()
  }

  const onNextStepClicked = (e) => {
    setCurrentStep(currentStep+1)
  }

  const onPreviousStepClicked = (e) => {
    setCurrentStep(currentStep-1)
  }

  const onDownloadClicked = (e) => {
    checkForFFmpeg().then(exist => {
      if(exist){
        setDownloadStep('Downloaded')
        createNotification('alert',"Files already exist, no need to redownload.");
      }else{
        console.log("Files Don't exist, let's download")
        handleDownloads()
      }
    })
  }
  const onReDownloadClicked = (e) => {
    try{
      var tmpDirRootPath = os.tmpdir();
      console.log(tmpDirRootPath);
      var tmpDatamosh2Path = path.join(tmpDirRootPath,"Datamosh2");
      fs.rmSync(tmpDatamosh2Path, { recursive: true, force: true });
      handleDownloads();
    }catch(err){
      createNotification('error',"Error redownloading files"+"\n" + err );
      downloadErrorDispatch();
    }
  }

  // Render buttons
  function renderFinalButton () {
    if (_shouldShowFinal()) {
      return (
        <NextButton className="next-button final-button" onClick={onFinalButtonClicked}>
          Let's Datamosh
        </NextButton>
      )
    } else return null
  }

  function renderNextButton (text) {
    if (_shouldShowNext()) {
      return (
        <NextButton className="next-button" onClick={onNextStepClicked}>{text}</NextButton>
      )
    } else return null
  }

  function renderDownloadButton (text,redownload) {
    if (_shouldShowDownload()) {
      if(downloadStep === "Downloaded"){
        return (
          <RedownloadButton className="redownload-button" onClick={onReDownloadClicked}>{redownload}</RedownloadButton>
        )
      }else{
        return (
          <DownloadButton className="download-button" onClick={onDownloadClicked}>{text}</DownloadButton>
        )
      }
    } else return null
  }

  function renderPreviousButton () {
    if (_shouldShowPrevious()) {
      return (
        <PreviousButton onClick={onPreviousStepClicked} className="previous-button" />
      )
    } else return null
  }

  // Other functions
  function handleDownloads(){
    try{
      //Make new dir if none in tempdir
      var tmpDirRootPath = os.tmpdir();
      console.log(tmpDirRootPath);
      var tmpDatamosh2Path = path.join(tmpDirRootPath,"Datamosh2");
      makeFolder(tmpDatamosh2Path);
      var tmpOSFfmpeg = path.join(tmpDatamosh2Path,OStype.current);
      makeFolder(tmpOSFfmpeg);
      //Set global path ref = tmpdir datamosh
      tmpDirPath.current=tmpOSFfmpeg;
      
      // Make folders for utility
      // Get the correct 7zBIN
      var zipPath = zipbin.path7za;
      var zipTypePath = zipPath.substring(zipPath.lastIndexOf(OStype.current.toLowerCase()),zipPath.length);
      var zipLocalPath = path.join( scriptPath.current, 'assets', 'utility', zipTypePath )
      var zipName = path.basename(zipLocalPath);
      var zipTmpFolderPath = path.join(tmpDatamosh2Path,"utility");
      var zipTmpPath = path.join(zipTmpFolderPath,zipName);
      makeFolder(zipTmpFolderPath);
      copyItem(zipLocalPath,zipTmpPath);
      setPermisions(zipTmpPath)

      // Download Links
      const options = {
        WIN: {
          ffmpegUrl: 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z',
          ffGlitchUrl: 'https://ffglitch.org/pub/bin/win64/ffglitch-0.9.4-win64-unicode.7z',
        },
        MAC: {
          ffmpegUrl: 'https://evermeet.cx/ffmpeg/ffmpeg-4.4.7z',
          ffGlitchUrl: 'http://ffglitch.org/pub/bin/mac64/ffglitch-0.9.3-mac64.7z',
        }
      }
  
      // Set remaining paths
      console.log("Starting to download");
      // var ffmpegFolder = path.join(__dirname,"ffmpeg",OStype.current);
      var ffmpegZipLocation = path.join(tmpOSFfmpeg,"ffmpeg.7z");
      var ffglitchZipLocation = path.join(tmpOSFfmpeg,"ffglitch.7z");
      
      console.log('File path xists? '+fs.existsSync(tmpOSFfmpeg))
      var ffmpegSearchKey = OStype.current == 'WIN' ? 'ffmpeg.exe' : 'ffmpeg';
      var ffglitchSearchKey = '*';
      
      setDownloadStep("Downloading FFmpeg");
      downloadFile((OStype.current=='WIN'?options.WIN.ffmpegUrl:options.MAC.ffmpegUrl), ffmpegZipLocation).then(res => {
        setDownloadStep("Downloading FFglitch");
        downloadFile((OStype.current=='WIN'?options.WIN.ffGlitchUrl:options.MAC.ffGlitchUrl), ffglitchZipLocation).then(res => {
          setDownloadStep("Unzipping");
          unzipFile(ffmpegZipLocation, tmpOSFfmpeg,zipTmpPath,ffmpegSearchKey).then(res => {
            unzipFile(ffglitchZipLocation, tmpOSFfmpeg,zipTmpPath,ffglitchSearchKey).then(res => {
              dispatchPaths().then(res => {
                setDownloadStep("Success!");
                createNotification('Success',"Succesfully downloaded files.");
              })
            })
          })
        })
      })
      
    }catch(err){
      createNotification('error',"Error making download paths file"+"\n" + err )
    }
    
  }

  
  function makeFolder(dir){
    if (!fs.existsSync(dir)){
      try{
        fs.mkdirSync(dir);
      }catch(err){
        createNotification('error',"Error making folder "+dir+"\n" + err )
      }
    }
  }
  function copyItem(srcDir,destDir){
    if (!fs.existsSync(destDir)){
      try{
        fs.copyFileSync(srcDir, destDir)
      }catch(err){
        createNotification('error',"Error copying 7zipbin to temp"+"\n" + err )
      }
    }
  }

  function downloadFile(url,destination){
    return new Promise((resolve,reject)=>{
      try{
        // const proto = !url.charAt(4).localeCompare('s') ? https : http;
        var file = fs.createWriteStream(destination);
        var requestUrl = request(url, (error, response, body)=>{
          if(error){
            createNotification('error',("Error downloading file"+"\n"+error));
            downloadErrorDispatch();
          } 
        });
        requestUrl.pipe(file);
        requestUrl.on('end', () => {
          resolve('Success in writing file')
        });
      }catch(err){
        createNotification('error',"Error downloading file"+"\n" + err )
        downloadErrorDispatch()
      }
    })
  }

  function unzipFile(location,destination,zBinPath,searchKey){
    return new Promise((resolve,reject) => {

      var args = [ 
        'e', location,
        `-o${destination}`,
        '-r',
        searchKey,
        '-aoa',
      ]
      var proc = spawn(zBinPath,args);
      proc.on('error', err => createNotification('error',("Error unzipping file"+"\n" + err )) );
      proc.on('close', (data) => {
          if (data != 0) {
            createNotification('error',("Error unzipping file   Data:   "+ data));
            downloadErrorDispatch()

          }
          resolve("success")
      });
      proc.stderr.on('data', err => {
        createNotification('error',"there was an issue unzipping the file at " + location + "  Err =  " + err);
        downloadErrorDispatch()
      });

      // const sevenStream = extractFull(location, destination, {
      //   $bin: zBinPath,
      //   recursive: true,
      // })
      // sevenStream.on('end', () => {
      //   resolve('success')
      // })
      // sevenStream.on('error', (err) => {
      //   createNotification('error',("Error unzipping file"+"\n" + err ));
      // })
    })
  }
  function downloadErrorDispatch(){
    createNotification('alert','Please navigate to the Datamosh 2 settings tab (located on the right side of the panel) and click on the manual install link inside of the paths section.');
  }

  function setPermisions(location){
    fs.chmodSync(location, "755");
  }

  // Dispatch event
  function dispatchPaths(obj){
    return new Promise((resolve,reject) => {
      try{
        var event = new CSEvent("com.aescripts.datamosh2.paths", "APPLICATION");
        event.data = 'update';
        new CSInterface().dispatchEvent(event);
        resolve('success')
      }catch(err){
        reject()
        createNotification('error',"Error sending paths to the main panel. Please close this panel and the main panel. Then, reopen Datamosh 2."+"\n" + err )
      }
    })
  }

  // function hasInternet(){
  //   return new Promise((resolve,reject)=>{
  //     dns.resolve('www.google.com', function(err) {
  //       if (err) {
  //          resolve(false);
  //       } else {
  //         resolve(true);
  //       }
  //     });
  //   })
  // }


  return (
    <TutorialContainer>
      <ImageSide>
        <ImageContainer src={_currentStep().image} downloadStep={downloadStep}/>
        <DownloadTextContainer downloadStep={downloadStep} _shouldShowDownload={_shouldShowDownload()}>
          <h2>{downloadStep}</h2>
        </DownloadTextContainer>
      </ImageSide>
      <CopySide>
        <CopyContainer>
          <h2>{_currentStep().title}</h2>
          {_currentStep().description}
          {renderDownloadButton(_currentStep().downloadButton,_currentStep().reDownloadButton)}
          <ButtonsContainer>
            {renderPreviousButton()}
            {renderNextButton(_currentStep().nextButton)}
            {renderFinalButton()}
          </ButtonsContainer>
        </CopyContainer>
      </CopySide>
    </TutorialContainer>
  )

}

const TutorialContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const CopyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  justify-content: space-between;
`
const CopySide = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.ae.panelBackgroundColor};
  width: 340px;
  height: 450px;
  padding: 0px 30px;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.text.bright};
`
const ImageSide = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background.dark};
  width: 280px;
  height: 450px;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
`
const ImageContainer = styled.img`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const DownloadTextContainer = styled.div`
  display: ${props => props._shouldShowDownload ? 'flex' : 'none'};
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 10px 0px;
`

export default Tutorial
