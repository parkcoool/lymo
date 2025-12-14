/**
 * 비동기적으로 데이터를 푸시할 수 있는 스트림 채널을 생성합니다.
 * @returns 스트림 채널 객체
 */
export function createStreamChannel<T>() {
  const queue: T[] = [];
  let resolveNext: ((result: IteratorResult<T>) => void) | null = null;
  let error: Error | null = null;
  let isClosed = false;

  const push = (data: T) => {
    if (isClosed) return;
    if (resolveNext) {
      resolveNext({ value: data, done: false });
      resolveNext = null;
    } else {
      queue.push(data);
    }
  };

  const fail = (err: Error) => {
    if (isClosed) return;
    error = err;
    if (resolveNext) {
      resolveNext({ value: undefined, done: true });
      resolveNext = null;
    }
  };

  const close = () => {
    if (isClosed) return;
    isClosed = true;
    if (resolveNext) {
      resolveNext({ value: undefined, done: true });
      resolveNext = null;
    }
  };

  const iterator = async function* () {
    while (!isClosed || queue.length > 0) {
      if (error) throw error;
      if (queue.length > 0) {
        yield queue.shift()!;
      } else {
        const result = await new Promise<IteratorResult<T>>((resolve) => {
          resolveNext = resolve;
        });
        if (result.done) {
          if (error) throw error;
          break;
        }
        yield result.value;
      }
    }
  };

  return { push, fail, close, iterator };
}
