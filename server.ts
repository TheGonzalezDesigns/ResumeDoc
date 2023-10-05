import { Hono } from "hono";
import { generate_documents, Log } from "./generate_documents";
import {
  questionnaire_surgeon,
  Script,
} from "./local_modules/questionnaire_surgeon";

// Create a new Hono instance
const app = new Hono();

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

app.get("/", (c) => c.text("Hello Bun!"));
app.get("/test", (c) => c.text("Testing Bun!"));

app.post("/generate", async (c) => {
  //console.info(c.req.headers);
  const body = await c.req.json();
  const job_profile = body.job_profile;
  let log: Log = {
    filenames: {
      resume: "",
      cover_letter: "",
    },
    status: false,
  };

  console.info("job_profile:", job_profile);

  try {
    log = await generate_documents();
    if (!log.status) throw "Generation Error";
    console.info("Generation success");
  } catch (error) {
    console.error("Generation failed:", error);
  }
  return c.json({ log });
});

app.post("/simulate", async (c) => {
  try {
    const { commands, delay = 1000 } = (await c.req.json()) ?? {};

    if (!Array.isArray(commands)) {
      console.error("Invalid command format: commands should be an array");
      return c.text("Invalid command format", 400);
    }

    for (const command of commands) {
      if (
        typeof command.type !== "string" ||
        !["key", "keys"].includes(command.type)
      ) {
        console.error("Invalid command type:", command.type);
        return c.text("Invalid command type", 400);
      }

      try {
        let child;
        if (command.type === "key" && typeof command.key === "string") {
          child = Bun.spawn(["xdotool", "key", command.key]);
        } else if (
          command.type === "keys" &&
          typeof command.keys === "string"
        ) {
          child = Bun.spawn(["xdotool", "type", command.keys]);
        } else {
          console.error("Invalid command format:", command);
          return c.text("Invalid command format", 400);
        }

        if (child) {
          await readStream(child.stdout, "STDOUT from child process:");
          if (child.stderr) {
            await readStream(child.stderr, "STDERR from child process:");
          }

          // Wait for the child process to exit
          const exit_code = await child.exited;

          console.info(
            `${exit_code == 0 ? "S" : "Uns"}uccessfuly simulated the ${
              command.type === "key"
                ? "pressing of `" + command.key
                : "typing of `" + command.keys
            }\``
          );

          // After processing each command, wait for the specified delay
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error("Error executing command:", command, error);
        return c.text("Error executing command", 500);
      }
    }

    return c.json({ status: "success" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return c.text("Unexpected Error", 500);
  }
});

async function readStream(
  stream: ReadableStream<Uint8Array>,
  logPrefix: string
) {
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

app.post("/questionnaire", async (c) => {
  try {
    const { html_snippet, personal_summary } = (await c.req.json()) ?? {};
    if (!(html_snippet !== undefined && Object.keys(html_snippet).length >= 1))
      throw "No HTML Provided.";
    if (!(personal_summary !== undefined && personal_summary.length >= 1))
      throw "No Personal Summary Provided.";
    const script = await questionnaire_surgeon(html_snippet, personal_summary);
    console.info("script:", script);
    return c.json({ status: "success", script });
  } catch (error) {
    console.error("Unexpected error:", error);
    return c.text("Unexpected Error", 500);
  }
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.info("Server started");
