import React from 'react';
import { useRef } from 'react';
import styles from "./speak.module.css"

const SpeakAnimation = ({ animationHeight = "300px", animationWidth = "300px", marginL = "35px" }) => {
  const speak1 = useRef(null);
  const speak2 = useRef(null);
  const speak3 = useRef(null);

  let volume = 0;
  // const players = document.querySelectorAll("lottie-player");

  // console.log(player)
  // if(player)player.setAttribute('speed', '0.25');
  function onMicrophoneDenied() {
    console.log("denied");
  }

  async function onMicrophoneGranted(stream) {
    try {
      const audioContext = new window.AudioContext();

      // console.log("Setting up volume processor");

      await audioContext.audioWorklet.addModule(
        new URL("./volume-processor.js", import.meta.url)
      );

      const mediaStreamSource = audioContext.createMediaStreamSource(stream);

      const node = new AudioWorkletNode(audioContext, "volume-processor");

      node.port.onmessage = (event) => {
        if (event.data.volume) {
          volume = Math.ceil(event.data.volume * 400);
        }
      };

      mediaStreamSource.connect(node).connect(audioContext.destination);

      render();
    } catch (error) {
        console.log(error);
    }
  }


  function render() {

    // if (player !== null) {
    //   const startVolume = 0;
    //   const steps = 20; // Adjust as needed
    //   const stepAmount = (volume - startVolume) / steps;
    //   let step = 0;

    //   const timer = setInterval(() => {
    //     step++;
    //     volume = startVolume + step * stepAmount;
    //     player.seek(`${volume}%`);


    //     if (step >= steps) {
    //       clearInterval(timer);
    //     }
    //   }, 0.5);
    // }

    if (speak1 !== null && speak2 !== null && speak3 !== null) {
      let vol;
      vol = volume + 20;
      vol = Math.min(vol, 100);
      let ran1 = Math.floor(Math.random() * (25 - 15)) + 15;
      let ran2 = Math.floor(Math.random() * (25 - 15)) + 15;
      // console.log("vol-------------------------- ", volume,vol);

      if (vol > 20) {
        speak1.current.style.height = `${vol - ran1 > 20 ? vol - ran1 : 20}%`;
        speak2.current.style.height = `${vol}%`;
        speak3.current.style.height = `${vol - ran2 > 20 ? vol - ran2 : 20}%`;
      }
      else {
        speak1.current.style.height = `${20}%`;
        speak2.current.style.height = `${20}%`;
        speak3.current.style.height = `${20}%`;
      }
    }
    // console.log(players)
    // if (players !== null && players[0] !== undefined) players[0].seek(`${volume}%`);
    // if (players !== null && players[1] !== undefined) players[1].seek(`${volume}%`);
    // console.log(`${volume * 1000}`)
    requestAnimationFrame(render);
  }

  navigator.getUserMedia(
    { audio: true },
    onMicrophoneGranted,
    onMicrophoneDenied
  );


  return (
    <>
      {/* <dotlottie-player
        src="https://lottie.host/37a0014c-32eb-487c-aef9-15883781132d/LvTfujqBc7.json" background="transparent"
        speed="0.5"
        style={{ height: animationWidth, width: animationHeight, marginLeft: marginL }}
        loop autoplay>
      </dotlottie-player> */}
      {/* <lottie-player
      src="https://lottie.host/09f2c110-bdbe-4e11-a6b3-9e3de64567cb/UAsvmx6gcM.json"
        // src="https://lottie.host/f9f907f8-b8ec-4522-aaaa-4d4b16e82c06/iDa5XFEJVf.json"
        // https://lottie.host/5f647bf5-bcfd-4050-9c51-26a6d09395c8/I9R9KL3tJm.json
        style={{ height: animationWidth, width: animationHeight, marginLeft: marginL }}
      // speed="1"
      ></lottie-player> */}
      <div className={styles.loaderCircle}>
        <div className={styles.loader}>
          <span ref={speak1} className={styles.stroke}></span>
          <span ref={speak2} className={styles.stroke}></span>
          <span ref={speak3} className={styles.stroke}></span>
        </div>
      </div>

    </>
  )
};

export default SpeakAnimation;
