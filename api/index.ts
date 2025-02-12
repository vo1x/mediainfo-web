import { Hono } from "hono";
import { getMetadataController } from "./controllers/gdriveController";
import { handle } from "hono/vercel";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));
app.get("/", (c) => {
  return c.json({ message: "Mediainfo API", version: "0.0.1" });
});

app.get("/drive/ddl", getMetadataController);

// export default app;

const handler = handle(app);

export const GET = handler;
export const POST = handler;
