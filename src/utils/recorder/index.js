import { uploadAudioToS3 } from 'src/services/aws.service';
import { postEvaluateSolution } from 'src/services/interviewclient.service';

export const getAudioProps = (
  status,
  audioSrc,
  setAudioSrc,
  question_id,
  interview_id,
  isLast,
  token_id,
  camImageUrls,
  setCamImageUrls,
) => {
  const audioProps = {
    audioType: 'audio/mp3',
    status,
    audioSrc,
    timeslice: 1000,
    startCallback: e => {
      console.log('succ start----------------------------------------', e);
    },
    pauseCallback: e => {
      console.log('succ pause', e);
    },
    stopCallback: async e => {
      const dummyImgUrls = [...camImageUrls];
      setCamImageUrls([]);
      const audioUrl = window.URL.createObjectURL(e);
      console.log('audio url is ', audioUrl);

      setAudioSrc(audioUrl);
      try {
        const transcribedText = await sendAudioTranscriptionRequest(
          e,
          question_id,
          interview_id,
          token_id,
          dummyImgUrls,
        );
        console.log(transcribedText);
      } catch (err) {
        console.log(err);
      }
      console.log('succ stop', e);
    },
    onRecordCallback: e => {
      // console.log('recording', e);
    },
    errorCallback: err => {
      console.log('error', err);
    },
  };

  return audioProps;
};

export const sendAudioTranscriptionRequest = async (
  audioBlob,
  question_id,
  interview_id,
  token_id,
  dummyImgUrls,
) => {
  // const response = await fetch(audioSrc);
  // const audioBlob = await response.blob();
  // const audioFile = new File([audioBlob], 'recorded_audio.mp3', {
  //   type: 'audio/mp3',
  // });

  console.log('Question ID ----------------------------------- ', question_id);
  uploadAudioToS3(audioBlob)
    .then(audioUrl => {
      console.log(audioUrl);
      const payload = {
        audio_file_url: audioUrl,
        candidate_captures: dummyImgUrls,
      };
      console.log('Payload --- ', payload);
      postEvaluateSolution(payload, question_id, interview_id, token_id)
        .then(data => {
          console.log('Evaluate solution data is ', data);
        })
        .catch(err => {
          console.log('Error evaluating solution', err);
        });
    })
    .catch(err => {
      console.log(err);
      console.log('Error uploading audio');
    });
};
