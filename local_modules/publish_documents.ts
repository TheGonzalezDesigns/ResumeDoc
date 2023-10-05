import { read_stream } from "local_modules/read_stream";

/**
 * Function to publish documents using an external shell script.
 * @returns {Promise<void>} - Resolves if successful, rejects if failed.
 */
export const publish_documents = async (): Promise<void> => {
  try {
    const child = Bun.spawn(["./publish.fish"]);

    if (child) {
      await read_stream(child.stdout, "STDOUT from child process:");
      if (child.stderr) {
        await read_stream(child.stderr, "STDERR from child process:");
      }

      const exit_code = await child.exited;
      if (exit_code !== 0) throw "Failed";
    }
  } catch (error) {
    throw "Failed to Publish documents";
  }
};
