import { z } from "zod";
const AdminSignUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
type AdminSignUpType = z.infer<typeof AdminSignUpSchema>;

//ADMIN LOGIN
const AdminLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});
type AdminLoginType = z.infer<typeof AdminLoginSchema>;
//AUTHOR COMPLETE DETAILS
const AuthorCompleteDetails = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  gender: z.string(),
  bank: z.object({
    accountNumber: z.string(),
    bank: z.string(),
    ifsc: z.string(),
    branch: z.string(),
  }),
  book: z.object({
    cover: z.string(),
    title: z.string(),
    genre: z.string(),
    description: z.string(),
  }),
  bio: z.string(),
  avatar: z.string(),
});
type AuthorCompleteDetailsType = z.infer<typeof AuthorCompleteDetails>;
export {
  AdminSignUpSchema,
  AdminSignUpType,
  AdminLoginSchema,
  AdminLoginType,
  AuthorCompleteDetails,
  AuthorCompleteDetailsType,
};
