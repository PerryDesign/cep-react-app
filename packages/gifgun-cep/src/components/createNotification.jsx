import React from 'react';
import Notification from './Notification';
import { store } from 'react-notifications-component';
import 'animate.css/animate.min.css';

function createNotification(type,message,id) {
    console.log("Creating Notification");

    var notificationOptions = {
      container: 'bottom-center',  // where to position the notifications
      animationIn: ["animate__animated animate__fadeIn"],     // animate.css classes that's applied
      animationOut: ["animate__animated animate__fadeOut"],   // animate.css classes that's applied
      dismiss: {
        duration: 300000,
      },
      // Animation
      touchRevert: {
          duration: 200,
          timingFunction: 'ease-out',
          delay: 0
      },
      slidingExit: {
          duration: 200,
          timingFunction: 'ease-out',
          delay: 0
      },
      slidingEnter: {
          duration: 200,
          timingFunction: 'ease-out',
          delay: 0
      },
      touchSlidingExit: {
          swipe: {
            duration: 0,
            timingFunction: 'ease-out',
            delay: 0,
          },
          fade: {
            duration: 500,
            timingFunction: 'ease-out',
            delay: 0
          }
      },
      content: (
          <Notification
              type={type}
              message={message}
          />
      ),
    }

    if(id){
      notificationOptions.id = id;
    }


    store.addNotification(
      notificationOptions
    )

}

export {createNotification};