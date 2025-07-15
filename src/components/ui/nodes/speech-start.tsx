'use client';

import React, { useState, useEffect, memo, ReactNode } from 'react';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Button } from '../button';
import { Typography } from '../typography';
import { useThemeToggle } from '@/hooks/theme-toggle';
import CustomHandle from '../handles/custom-handle';
import { Loader2, Mic, StopCircle, TimerReset, X } from 'lucide-react';
import { SystemTool } from '@/_backend/getSystemTools';
import { useHapticSound } from '@/hooks/useHapticSound';
import { useFlow } from '@/context/flow-context';
import { cn } from '@/lib/utils';

const MAX_DURATION = 30; // in seconds
type UnionType = SystemTool & { delete: ReactNode };

const RecordAudioNodeComp: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const { theme } = useThemeToggle();
  const { setAudioData, uploadingAudio } = useFlow();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [seconds, setSeconds] = useState(0);

  const [nodeData, setNodeData] = useState<UnionType>();
  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);
  // "/transcribe"
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

  const onDeleteHandler = () => {
    setEdges(eds =>
      eds.filter(
        edge =>
          edge.source !== nodeData?.node_id &&
          edge.target !== nodeData?.node_id,
      ),
    );
    setNodes(nds => nds.filter(node => node.id !== nodeData?.node_id));
  };
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
        setAudioData(completeBlob);
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
      console.error('Mic access denied or error: ', err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };
  const play = useHapticSound('/node-drag.wav', 0.1);
  console.log({ recording });
  return (
    <motion.div
      drag
      dragListener={true} // default true
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={() => {
        play();
      }}
      className={cn(
        'group shadow-md active:shadow-lg shadow-gray-500/30 dark:shadow-gray-950 dark:bg-zinc-800 active:bg-zinc-200 bg-zinc-100 p-2 rounded-xl max-w-[200px] min-w-[200px] border dark:border-zinc-500 border-emerald-600 dark:hover:border-emerald-600 hover:border-emerald-500 transition-all duration-100 flex flex-col gap-2 ease-linear',
        uploadingAudio ? 'dark:border-emerald-600 border-emerald-500 ' : '',
      )}>
      <div className="flex justify-between items-center">
        <Typography
          variant="h4"
          className={cn(
            'text-sm dark:text-zinc-400 text-zinc-600 dark:group-hover:text-emerald-600 group-hover:text-emerald-600 transition-all duration-100 ease-linear',
            uploadingAudio ? 'text-emerald-600 dark:text-emerald-600' : '',
          )}>
          Record Audio
        </Typography>
        <Button
          variant={'ghost'}
          className="hover:shadow-none dark:hover:bg-transparent hover:bg-transparent shadow-none absolute top-[-2px] right-[-2px] "
          onClick={onDeleteHandler}>
          <X />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1">
        {uploadingAudio ? (
          <Loader2 size={33} className="animate-spin text-c-secondary" />
        ) : (
          <Button
            size="icon"
            variant={recording ? 'destructive' : 'secondary'}
            onClick={() => {
              console.log('click', recording);
              if (recording) {
                console.log('click stop', recording);
                stopRecording();
              } else {
                console.log('click start', recording);
                startRecording();
              }
              // recording ? stopRecording : startRecording
            }}
            className="p-4">
            {recording ? <StopCircle size={16} /> : <Mic size={16} />}
          </Button>
        )}

        <div className="text-[12px] text-center text-muted-foreground  my-2">
          <TimerReset size={10} className="inline mr-1" />
          {seconds}s / {MAX_DURATION}s
        </div>
      </div>

      <CustomHandle
        connectionCount={1}
        style={{
          backgroundColor:
            theme === 'dark'
              ? 'var(--color-emerald-600)'
              : 'var(--color-emerald-800)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </motion.div>
  );
};

export const RecordAudioNode = memo(RecordAudioNodeComp);
