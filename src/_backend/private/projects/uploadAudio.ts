'use server';
import { APIResponse } from '@/_backend/models/response';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

interface AudioTranscriptResponse {
  text: string;
}

export const uploadAudio = async (
  file: Blob,
  flow_id: string,
): Promise<APIResponse<AudioTranscriptResponse> | null> => {
  const endpoint = `${url}/transcribe`;
  const formData = new FormData();
  formData.append('audio', file, `${flow_id}.wav`); // must match FastAPI's input param name
  formData.append('flow_id', flow_id);
  const { getToken } = await auth();
  const token = await getToken();
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('RESPONSE: ', res);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Transcription failed');
    }

    const data: APIResponse<AudioTranscriptResponse> = await res.json();
    return data;
  } catch (error) {
    console.log('ERROR: ', error);

    return {
      data: null,
      error: 'Error: ' + error,
      isSuccess: false,
      message: 'Error: ' + error,
    };
  }
};
