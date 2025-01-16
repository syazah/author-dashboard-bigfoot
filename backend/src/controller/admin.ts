import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import {
  AdminLoginSchema,
  AdminLoginType,
  AdminSignUpSchema,
  AdminSignUpType,
} from "../types/admin";
import bcryptjs from "bcryptjs";
export const AdminSignupController = async (c: Context) => {
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    // ACCEPTING BODY
    const SignUpFormData: AdminSignUpType = await c.req.json();
    const validate = AdminSignUpSchema.safeParse(SignUpFormData);
    if (!validate.success) {
      c.status(400);
      throw new Error(validate.error.errors[0].message);
    }
    //CREATE USER
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(SignUpFormData.password, salt);
    await prisma.admin.create({
      data: {
        name: SignUpFormData.name,
        email: SignUpFormData.email,
        username: SignUpFormData.username,
        password: hashedPassword,
      },
    });
    return c.json({ success: true, message: "User Was Created" });
  } catch (error) {
    throw error;
  }
};

//ADMIN LOGIN
export const AdminLoginController = async (c: Context) => {
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    // ACCEPTING BODY
    const LoginFormData: AdminLoginType = await c.req.json();
    const validate = AdminLoginSchema.safeParse(LoginFormData);
    if (!validate.success) {
      c.status(400);
      throw new Error(validate.error.errors[0].message);
    }
    //FIND USER
    const user = await prisma.admin.findUnique({
      where: {
        username: LoginFormData.username,
      },
    });
    if (!user) {
      c.status(404);
      throw new Error("User Not Found");
    }
    //COMPARE PASSWORD
    const isPasswordValid = bcryptjs.compareSync(
      LoginFormData.password,
      user.password
    );
    if (!isPasswordValid) {
      c.status(401);
      throw new Error("Invalid Password");
    }
    return c.json({ success: true, message: "User Logged In", id: user.id });
  } catch (error) {
    throw error;
  }
};
