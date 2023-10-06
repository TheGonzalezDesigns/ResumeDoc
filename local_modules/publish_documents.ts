/**
 * Function to publish documents using an external shell script.
 * @returns {Promise<void>} - Resolves if successful, rejects if failed.
 */
export const publish_documents = async (): Promise<void> => {
  try {
    const result = Bun.spawnSync(["./publish.fish"]);

    if (result.exitCode !== 0) {
      throw new Error("Failed to Publish documents");
    }

    if (result.stdout) {
      console.log("STDOUT from child process:", result.stdout.toString());
    }

    if (result.stderr) {
      console.log("STDERR from child process:", result.stderr.toString());
    }
  } catch (error) {
    throw new Error("Failed to Publish documents");
  }
};
