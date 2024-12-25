import { Hono } from "hono";
import { AdminSignupController } from "../controller/admin";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

//AUTH ROUTES
app.post("signup", AdminSignupController);

export default app;
