import { Hono } from "hono";
import { getMetadataController } from "./controllers/gdriveController";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Mediainfo API", version: "0.0.1" });
});

app.get("/drive/ddl", getMetadataController);

// export default app;

export const GET = handle(app);
export const POST = handle(app);
