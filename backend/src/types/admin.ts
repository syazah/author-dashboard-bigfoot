import { z } from "zod";
const AdminSignUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
type AdminSignUpType = z.infer<typeof AdminSignUpSchema>;
export { AdminSignUpSchema, AdminSignUpType };
