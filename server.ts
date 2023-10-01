// THIS IS BOILERPLATE, THE ENDPOINTS STILL NEED TO BE BUILT ENTIRELY
// Import Bun and the FileSystemRouter module
import Bun from "bun";
import FileSystemRouter from "bun/fs-router";
import { Request, Response } from "bun/http";

// Create a new FileSystemRouter instance
const router = new FileSystemRouter();

// Define the GET endpoint for /status?job=...
router.get("/status", (req: Request) => {
  const job = req.query.get("job");
  if (!job) return new Response("Job parameter is missing", { status: 400 });
  return new Response(`The status of job ${job} is ...`);
});

router.post("/generate", async (req: Request) => {
  try {
    const body = await req.json();
    const jobProfile = body.job_profile;
    // Replace ... with your logic
    const output = { result: "Replace with your logic" };
    return new Response(JSON.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

router.get("/questionaire", async (req: Request) => {
  try {
    const body = await req.json();
    const htmlSnippet = body.html_snippet;
    // Replace ... with your logic
    const document = Bun.render(htmlSnippet);
    const output = { result: "Replace with your logic" };
    return new Response(JSON.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

router.post("/select_file", (req: Request) => {
  try {
    const filePath = req.query.get("file_path");
    if (!filePath) return new Response("File path is missing", { status: 400 });
    // Replace ... with your logic
    const file = Bun.file(filePath);
    const output = { result: "Replace with your logic" };
    return new Response(JSON.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

// Start the server with the router as the fetch handler
Bun.serve({
  fetch: router.fetch,
});
