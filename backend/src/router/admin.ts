import { Hono } from "hono";
import {
  AdminLoginController,
  AdminSignupController,
} from "../controller/admin";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

//AUTH ROUTES
app.post("/signup", AdminSignupController);
app.post("/login", AdminLoginController);

export default app;
