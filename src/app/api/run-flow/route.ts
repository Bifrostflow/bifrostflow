'use server';
// /app/api/run-flow/route.ts
import { runFlowWithInput } from '@/_backend/runFlow';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of runFlowWithInput(body)) {
          const encoded = new TextEncoder().encode(
            `data: ${JSON.stringify(chunk)}\n\n`,
          );
          controller.enqueue(encoded);
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
