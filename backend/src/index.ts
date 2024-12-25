import { Hono } from "hono";
import { cors } from "hono/cors";
import adminRouter from "./router/admin";
// SETTING UP HONE
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();
app.use(cors());
//ROUTES
app.route("/api/admin/", adminRouter);
// SERVER
app.get("/", (c) => {
  return c.json({ server: "RUNNING" });
});
//CATCH ERROR
app.onError((err, c) => {
  return c.json({ success: false, message: err.message });
});
export default app;
