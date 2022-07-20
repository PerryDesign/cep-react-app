import React from 'react'
import { openUrl } from '../openUrl'
import styled from 'styled-components'
// import Welcome from '../../assets/tutorial/1_Welcome.gif'

const StyledLink = styled.a`
  color: ${props => props.theme.ae.systemHighlightColor};
`

export const TUTORIAL_STEPS = [
  {
    title: 'Let\'s Datamosh',
    image: 'assets/tutorial/1_Welcome.gif',
    nextButton: 'Let\'s Go',
    description: (
      <p>Get to know your way around Datamosh so we can help you break s!&%.</p>
    )
  },
  {
    title: 'How it Works',
    image: 'assets/tutorial/2_How_it_works.gif',
    nextButton: 'Continue',
    description: (
      <div>
        <p>Datamosh is a processing tool which works differently than your typical plugin:</p>
        <ol>
          <li>Create a mosh marker and set the in and out points.</li>
          <li>Click the Datamosh button. Your work area will be rendered out and moshed in the background. </li>
          <li>Your moshed video is then inserted into the timeline.</li>
        </ol>
      </div>
    )
  },
  {
    title: 'Download Externals',
    image: 'assets/tutorial/3_Download_externals.gif',
    nextButton: 'Continue',
    downloadButton: 'Download',
    reDownloadButton: 'Re‑Download',
    description:  (
      <div>
        <p>In order to reach new pixel dimensions, Datamosh 2 requires two external tools.</p>
        <p>FFmpeg is a famous command line video editing project. It helps us split, merge, break and fix videos. <StyledLink href="https://www.ffmpeg.org/" target="_blank" onClick={openUrl}>Find more information.</StyledLink></p>
        <p>FFglitch by Ramiro Pollo is a bitstream editor that allows us to hijack the **** out of pixel motion. It is the backbone for all of the moshing algorithms. <StyledLink href="https://www.ffglitch.org/" target="_blank" onClick={openUrl}>Find more information.</StyledLink>.</p>
        <p>Please click ‘Download’ below to make sure everything is kosher.</p>
      </div>
    )
  },
  {
    title: 'Hijack Motion',
    image: 'assets/tutorial/4_Hijack_Motion.gif',
    nextButton: 'Continue',
    description: (
      <div>
        <p>New to Datamosh 2 is an intuitive marker workflow with ninja precision. Start by clicking the + button located in the middle of the panel. This will create a new marker layer and a new module in the Datamosh 2 panel. </p>
        <p>Select a mosh algorithm from the 60+ different  presets or click to the drop down to expose a variety of  moshing parameters.</p>
        <p>Drag the in and out points of the marker to select which portion of your clip should be moshed</p>
      </div>
    )
  },
  {
    title: 'Remove Frames',
    image: 'assets/tutorial/5_Remove_Frames.gif',
    nextButton: 'Mosh Me Baby',
    description: (
      <div>
        <p>Continuing with the marker workflow, we have implemented a similar system for removing frames.</p>
        <p>Start by toggling the  ‘Remove Frames’ box at the top of the panel. Then click the + button next to the toggle to create a new remove frames layer. </p>
        <p>Drag the marker to the first frame of a new clip and click Datamosh. This will render out your timeline work area and will delete the frame at the marker.</p>
      </div>
    )
  },
  {
    title: 'Tweak & Re-Render',
    image: 'assets/tutorial/6_Use_Previous_Render.gif',
    nextButton: 'I Get It',
    description: (
      <div>
        <p>Once you have rendered out a mosh in a composition you will see the ‘Use Previous Render’ toggle appear. </p>
        <p>If you would like to make edits to the mosh parameters or times without having to re-render the clip you can set this to be toggled when clicking Datamosh again. This will use the previous rendered clip and apply the new mosh settings.</p>
        <p>If you have made any changes in After Effects to the underlying clips, please leave this unchecked. We need to render out a new updated clip!</p>
      </div>
    )
  },
  {
    title: 'Experiment',
    image: 'assets/tutorial/7_Thirsty_for_more.gif',
    nextButton: 'Let\'s Break Some Videos',
    description: (
      <div>
        <p>Datamosh 2 aims to be both simple to use and feature rich. To learn about some of the more advanced feautres such as Intensity, Acceleration, Blend, Threshold and Swapping please refer to the tutorial video.</p>
        <p>Got some dope moshes to show us? Hit us up on Instagram
          @<StyledLink href="https://www.instagram.com/datamosh/" target="_blank" onClick={openUrl}>datamosh</StyledLink></p>
        <p><em><strong>Want to see the tutorial again?</strong> Just go to the about tab and click the
          "Show Tutorial" button.</em></p>
      </div>
    )
  }
]