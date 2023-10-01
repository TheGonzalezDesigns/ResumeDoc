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
    status: false,
  };

  console.info("job_profile:", job_profile);

  try {
    //log = await generate_documents();
    if (!log.status) throw "Generation Error";
    console.info("Generation success");
  } catch (error) {
    console.error("Generation failed:", error);
  }
  //// Replace ... with your logic
  return c.json({ log });
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.info("Server started");
