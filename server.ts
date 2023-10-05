import { Hono } from "hono";
import { generate_documents, Log } from "./generate_documents";
import {
  questionnaire_surgeon,
  Script,
} from "./local_modules/questionnaire_surgeon";

/**
 * Initialize a new Hono instance.
 */
const app = new Hono();

/**
 * Handle 404 errors.
 * @param {any} c - Context object.
 * @returns {any} - Response object.
 */
app.notFound((c) => c.text("Custom 404 Message", 404));

/**
 * Handle other errors.
 * @param {Error} err - The error object.
 * @param {any} c - Context object.
 * @returns {any} - Response object.
 */
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

/**
 * Home route.
 * @param {any} c - Context object.
 * @returns {any} - Response object.
 */
app.get("/", (c) => c.text("Hello Bun!"));

/**
 * Test route.
 * @param {any} c - Context object.
 * @returns {any} - Response object.
 */
app.get("/test", (c) => c.text("Testing Bun!"));

/**
 * Generate documents.
 * @param {any} c - Context object.
 * @returns {Promise<any>} - Response object.
 */
app.post("/generate", async (c) => {
  const body = await c.req.json();
  const job_profile = body.job_profile;
  let log: Log = {
    filenames: {
      resume: "",
      cover_letter: "",
    },
    status: false,
  };

  try {
    log = await generate_documents(job_profile);
    if (!log.status) throw "Generation Error";
  } catch (error) {
    console.error("Generation failed:", error);
  }
  return c.json({ log });
});

/**
 * Simulate keypresses or typing.
 * @param {any} c - Context object.
 * @returns {Promise<any>} - Response object.
 */
app.post("/simulate", async (c) => {
  try {
    const { commands, delay = 1000 } = (await c.req.json()) ?? {};

    if (!Array.isArray(commands)) {
      return c.text("Invalid command format", 400);
    }

    for (const command of commands) {
      if (!["key", "keys"].includes(command.type)) {
        return c.text("Invalid command type", 400);
      }

      try {
        let child;
        if (command.type === "key") {
          child = Bun.spawn(["xdotool", "key", command.key]);
        } else {
          child = Bun.spawn(["xdotool", "type", command.keys]);
        }

        if (child) {
          await readStream(child.stdout, "STDOUT from child process:");
          if (child.stderr) {
            await readStream(child.stderr, "STDERR from child process:");
          }

          const exit_code = await child.exited;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        return c.text("Error executing command", 500);
      }
    }

    return c.json({ status: "success" });
  } catch (error) {
    return c.text("Unexpected Error", 500);
  }
});

/**
 * Read from a stream and log the output.
 * @param {ReadableStream<Uint8Array>} stream - The stream to read from.
 * @param {string} logPrefix - Prefix for log messages.
 * @returns {Promise<void>}
 */
async function readStream(
  stream: ReadableStream<Uint8Array>,
  logPrefix: string
): Promise<void> {
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
}

/**
 * Handle questionnaire input.
 * @param {any} c - Context object.
 * @returns {Promise<any>} - Response object.
 */
app.post("/questionnaire", async (c) => {
  try {
    const { html_snippet, personal_summary } = (await c.req.json()) ?? {};
    if (!html_snippet || !personal_summary) {
      throw "Invalid input";
    }
    console.time("Testing_QS");
    const script: Script = await questionnaire_surgeon(
      html_snippet,
      personal_summary
    );
    console.timeEnd("Testing_QS");
    return c.json({ metadata: { status: true, script } });
  } catch (error) {
    return c.json({ metadata: { status: false, script: "" } });
  }
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.info("Server started");
