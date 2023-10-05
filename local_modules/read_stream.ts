/**
 * Read from a stream and log the output.
 * @param {ReadableStream<Uint8Array>} stream - The stream to read from.
 * @param {string} logPrefix - Prefix for log messages.
 * @returns {Promise<void>}
 */
export const read_stream = async (
  stream: ReadableStream<Uint8Array>,
  logPrefix: string
): Promise<void> => {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      console.log(`${logPrefix} ${new TextDecoder().decode(value)}`);
    }
  } catch (error) {
    console.error("Error reading from stream:", error);
  } finally {
    reader.releaseLock();
  }
};
