// genkit/beta/client의 `__flowRunEnvelope` 함수는 node의 fetch를 사용합니다.
// 하지만 node의 fetch는 스트리밍 응답을 제대로 처리하지 못하는 문제가 있어,
// expo/fetch를 사용하도록 해당 함수를 복사하여 사용합니다.

/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Channel } from "@genkit-ai/core/async";
import { fetch } from "expo/fetch";

const __flowStreamDelimiter = "\n\n";

async function __flowRunEnvelope({
  url,
  input,
  sendChunk,
  headers,
  abortSignal,
}: {
  url: string;
  input: any;
  sendChunk: (chunk: any) => void;
  headers?: Record<string, string>;
  abortSignal?: AbortSignal;
}) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data: input,
    }),
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      ...headers,
    },
    signal: abortSignal,
  });
  if (response.status !== 200) {
    throw new Error(`Server returned: ${response.status}: ${await response.text()}`);
  }
  if (!response.body) {
    throw new Error("Response body is empty");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  while (true) {
    const result = await reader.read();
    const decodedValue = decoder.decode(result.value);
    if (decodedValue) {
      buffer += decodedValue;
    }
    // If buffer includes the delimiter that means we are still receiving chunks.
    while (buffer.includes(__flowStreamDelimiter)) {
      const chunk = JSON.parse(
        buffer.substring(0, buffer.indexOf(__flowStreamDelimiter)).substring("data: ".length)
      );
      if (chunk.hasOwnProperty("message")) {
        sendChunk(chunk.message);
      } else if (chunk.hasOwnProperty("result")) {
        return chunk.result;
      } else if (chunk.hasOwnProperty("error")) {
        throw new Error(`${chunk.error.status}: ${chunk.error.message}\n${chunk.error.details}`);
      } else {
        throw new Error("unknown chunk format: " + JSON.stringify(chunk));
      }
      buffer = buffer.substring(
        buffer.indexOf(__flowStreamDelimiter) + __flowStreamDelimiter.length
      );
    }
  }
  throw new Error("stream did not terminate correctly");
}

export function streamFlow<O, S>({
  url,
  input,
  headers,
  abortSignal,
}: {
  url: string;
  input?: unknown;
  headers?: Record<string, string>;
  abortSignal?: AbortSignal;
}): {
  readonly output: Promise<O>;
  readonly stream: AsyncIterable<S>;
} {
  const channel = new Channel<S>();

  const operationPromise = __flowRunEnvelope({
    url,
    input,
    sendChunk: (c) => channel.send(c),
    headers,
    abortSignal,
  });
  operationPromise.then(
    () => channel.close(),
    (err) => channel.error(err)
  );

  return {
    output: operationPromise,
    stream: channel,
  };
}
