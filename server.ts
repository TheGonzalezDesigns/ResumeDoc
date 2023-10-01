import { generate_documents, Log } from "./generate_documents";
import { Hono } from "hono";

// Create a new Hono instance
const app = new Hono();

/*
app.get("/questionaire", async (c) => {
  try {
    const body = await c.req.json();
    const html_snippet = body.html_snippet;
    // Replace ... with your logic
    console.info("html_snippet:", html_snippet);
  } catch (error) {
    // Handle error
  }
});

app.post("/select_file/:file_path", (c) => {
  try {
    const file_path = c.req.param("file_path");
    // Replace ... with your logic
    console.info("file_path:", file_path);
  } catch (error) {
    // Handle error
  }
});
*/

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
    status: true,
  };

  console.info("job_profile:", job_profile);

  try {
    //log = await generate_documents();
    if (!log.status) throw "Generation Error";
    console.info("Generation success");
  } catch (error) {
    console.error("Generation failed:", error);
  }
  return c.json({ log });
});

app.post("/simulate", async (c) => {
  try {
    const commands = (await c.req.json())?.commands;

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
          const stdoutText = await new Response(child.stdout).text();
          console.log("STDOUT from child process:", stdoutText);

          if (child.stderr) {
            const stderrText = await new Response(child.stderr).text();
            console.error("STDERR from child process:", stderrText);
          }

          child.exited
            .then((exitCode) => {
              console.log(`Child process exited with code: ${exitCode}`);
            })
            .catch((error) => {
              console.error("Child process exited with error:", error);
            });
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

export default {
  port: 8080,
  fetch: app.fetch,
};

console.info("Server started");
