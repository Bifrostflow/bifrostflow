import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { Mic, StopCircle, TimerReset } from 'lucide-react';
import { useFlow } from '@/context/flow-context';
import { uploadAudio } from '@/_backend/private/projects/uploadAudio';
import { showToast } from '../toast';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
const MAX_DURATION = 30; // in seconds

const RecordAudio = () => {
  const {
    runFlowHandler,
    setUploadingAudio,
    slug,
    setUILoaderText,
    uploadingAudio,

    setRunningFlow,
  } = useFlow();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [seconds, setSeconds] = useState(0);
  //   const [showHide, setShowHide] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recording && seconds < MAX_DURATION) {
      timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else if (seconds >= MAX_DURATION) {
      stopRecording();
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording, seconds]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = () => {
        const completeBlob = new Blob(chunks, {
          type: 'audio/webm;codecs=opus',
        });
        onStopRecording(completeBlob);
        console.log({ completeBlob });
      };

      setMediaRecorder(recorder); // 💡 MUST set this before anything
      setSeconds(0);

      // ✅ Delay to ensure state flush before start
      setTimeout(() => {
        recorder.start();
        setRecording(true); // ✅ This triggers UI update after start
        console.log('🎙️ Recording actually started after state flush');
      }, 100); // 🔥 This 100ms delay ensures React updates before mediaRecorder kicks in
    } catch (err) {
      showToast({ description: 'Mic access denied or error: ' + err });
      console.error('Mic access denied or error: ', err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };
  const onStopRecording = async (audio: Blob | null) => {
    if (audio) {
      setUploadingAudio(true);
      setRunningFlow(true);
      try {
        setUILoaderText(prev => [
          ...prev,
          'Hmm... let me sleep on it and think it through.',
        ]);
        const audioResponse = await uploadAudio(audio, slug);
        console.log({ audioResponse });

        if (!audioResponse?.isSuccess) {
          setRunningFlow(false);
          showToast({
            description: audioResponse?.message,
            type: 'error',
          });
          return;
        }
        if (!audioResponse.data?.text) {
          setRunningFlow(false);
          showToast({
            description:
              'Sorry for the inconvenience, can you please speak again?',
            type: 'error',
          });
          return;
        }
        setUILoaderText(prev => [
          ...prev,
          'So your query is: ' + audioResponse.data?.text,
        ]);
        setUILoaderText(prev => [...prev, 'Well i can do that']);
        runFlowHandler({
          message: audioResponse.data?.text,
        });
      } catch (error) {
        setUILoaderText(prev => [
          ...prev,
          'Oh, that didn’t go as planned. Let’s try again — I’m listening.',
        ]);
        setRunningFlow(false);
        showToast({
          description: `${error}`,
          type: 'error',
        });
      } finally {
        setUploadingAudio(false);
      }
    } else {
      setUILoaderText(prev => [
        ...prev,
        'Oh, that didn’t go as planned. Let’s try again — I’m listening.',
      ]);
      showToast({
        title: 'No Audio!',
        description: 'Sorry for the inconvenience, can you please speak again?',
        type: 'success',
      });
    }
  };
  return (
    <div className="flex flex-col w-full justify-center items-center h-full mb-2">
      <AnimatePresence mode="wait">
        {uploadingAudio && (
          <motion.div
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 0.95, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'circIn' }}
            className="absolute bottom-[15px] bg-c-surface rounded-full p-1.5 overflow-hidden right-10">
            <video
              className="rounded-full"
              id="1234"
              src="/loader.webm"
              controls={false}
              loop
              autoPlay={true}
              muted
              style={{ width: 70, height: 70 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        variant={recording ? 'destructive' : 'secondary'}
        onClick={() => {
          //   setShowHide(!showHide);
          console.log('click', recording);
          if (recording) {
            console.log('click stop', recording);
            stopRecording();
          } else {
            console.log('click start', recording);
            startRecording();
          }
        }}
        className={cn('p-4', recording ? 'animate-pulse' : '')}>
        {recording ? <StopCircle size={16} /> : <Mic size={16} />}
        {recording ? 'Stop' : 'Start'}
      </Button>{' '}
      <AnimatePresence>
        {recording && (
          <motion.div
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 0.95, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'circIn' }}
            className="text-[16px] text-center text-c-surface-text absolute left-10 bottom-auto top-auto h-auto font-semibold">
            <TimerReset size={10} className="inline mr-1" />
            {seconds}s / {MAX_DURATION}s
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecordAudio;
