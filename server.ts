import { generate_documents } from "./generate_documents";
import { Hono } from "hono";

// Create a new Hono instance
const app = new Hono();

/*
// Define the GET endpoint for /status?job=...
app.get("/status/:job", (c) => {
  const job = c.req.param("job");
  if (!job) return c.text("Job parameter is missing");
  return c.text(`The status of job ${job} is ...`);
});

app.post("/generate", async (c) => {
  try {
    const body = await c.req.json();
    const job_profile = body.job_profile;
    // Replace ... with your logic
    console.info("job_profile:", job_profile);
  } catch (error) {
    // Handle error
  }
});

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
  console.info("job_profile:", job_profile);
  try {
    await generate_documents();
    console.info("Generation success");
  } catch (error) {
    console.error("Generation failed:", error);
  }
  //// Replace ... with your logic
  return c.json(body);
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.info("Server started");
