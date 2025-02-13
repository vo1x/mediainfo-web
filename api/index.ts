import { Hono } from "hono";
import { getMetadataController } from "./controllers/gdriveController";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "https://mediainfo-web.vercel.app"],
  })
);

app.get("/", (c) => {
  return c.json({ message: "Mediainfo API", version: "0.0.1" });
});

app.get("/drive/ddl", getMetadataController);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
