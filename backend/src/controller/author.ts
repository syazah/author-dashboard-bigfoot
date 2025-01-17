import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import {
  AdminLoginSchema,
  AdminLoginType,
  AdminSignUpSchema,
  AdminSignUpType,
  AuthorCompleteDetails,
  AuthorCompleteDetailsType,
} from "../types/admin";
import bcryptjs from "bcryptjs";
export const AuthorSignUpController = async (c: Context) => {
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
    await prisma.author.create({
      data: {
        name: SignUpFormData.name,
        email: SignUpFormData.email.toLowerCase(),
        username: SignUpFormData.username.toLowerCase(),
        password: hashedPassword,
      },
    });
    return c.json({ success: true, message: "Author Was Created" });
  } catch (error) {
    throw error;
  }
};
//AUTHOR LOGIN
export const AuthorLoginController = async (c: Context) => {
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //ACCEPTING BODY
    const LoginFormData: AdminLoginType = await c.req.json();
    const validate = AdminLoginSchema.safeParse(LoginFormData);
    if (!validate.success) {
      c.status(400);
      throw new Error(validate.error.errors[0].message);
    }
    //FIND USER
    const user = await prisma.author.findUnique({
      where: {
        username: LoginFormData.username,
      },
    });
    if (!user) {
      c.status(400);
      throw new Error("User not found");
    }
    //CHECK PASSWORD
    const passwordMatch = bcryptjs.compareSync(
      LoginFormData.password,
      user.password
    );
    if (!passwordMatch) {
      c.status(400);
      throw new Error("Password is incorrect");
    }
    return c.json({
      success: true,
      message: "Logged In",
      id: user.id,
      completed: user.gender ? true : false,
    });
  } catch (error) {
    throw error;
  }
};
//GET AUTHOR
export const AuthorDetailsController = async (c: Context) => {
  try {
    // PRISMA CONFIGURATIONS
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //GET AUTHOR
    const author = await prisma.author.findUnique({
      where: {
        id: id,
      },
      include: {
        books: true,
        bank: true,
        excels: true,
      },
    });
    if (!author) {
      c.status(400);
      throw new Error("Author not found");
    }
    return c.json({ success: true, author });
  } catch (error) {
    throw error;
  }
};
//GET ALL AUTHORS
export const AllAuthorsController = async (c: Context) => {
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //GET AUTHORS
    const authors = await prisma.author.findMany();
    return c.json({ success: true, authors });
  } catch (error) {
    throw error;
  }
};
//SEARCH AUTHOR
export const SearchAuthorController = async (c: Context) => {
  try {
    const query = c.req.query("query")?.toLowerCase();
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //SEARCH AUTHOR
    const authors = await prisma.author.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return c.json({ success: true, authors });
  } catch (error) {
    throw error;
  }
};
//UPDATE AUTHOR DETAILS
export const AuthorUpdateDetailController = async (c: Context) => {
  try {
    const authorId = c.req.param("authorId");
    const detailForm: AuthorCompleteDetailsType = await c.req.json();
    const validate = AuthorCompleteDetails.safeParse(detailForm);
    if (!validate.success) {
      c.status(400);
      throw new Error(validate.error.errors[0].message);
    }
    if (!authorId) {
      throw new Error("Author Id is required");
    }
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //UPDATE AUTHOR
    await prisma.author.update({
      where: {
        id: authorId,
      },
      data: {
        name: detailForm.name,
        email: detailForm.email,
        username: detailForm.username,
        bio: detailForm.bio,
        gender: detailForm.gender === "MALE" ? "MALE" : "FEMALE",
        profilePic: detailForm.avatar,
        bank: {
          create: {
            name: detailForm.bank.bank,
            accountNumber: detailForm.bank.accountNumber,
            ifsc: detailForm.bank.ifsc,
            branch: detailForm.bank.branch,
          },
        },
        books: {
          create: {
            title: detailForm.book.title,
            description: detailForm.book.description,
            genre: detailForm.book.genre,
            image: detailForm.book.cover,
          },
        },
      },
      include: {
        bank: true,
        books: true,
      },
    });
    return c.json({ success: true, message: "Author Updated" });
  } catch (error) {
    throw error;
  }
};
//AUTHOR EXCEL UPLOAD CONTROLLER
export const AuthorExcelUploadController = async (c: Context) => {
  const {
    username,
    url,
    date,
  }: { username: string; url: string; date: string } = await c.req.json();
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //UPLOAD EXCEL SHEET
    const user = await prisma.author.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.excel.create({
      data: {
        authorId: user.id,
        file: url,
        date,
        name: `${username}-${date}`,
      },
    });
    return c.json({ success: true, message: "Excel Sheet Uploaded" });
  } catch (error) {
    throw error;
  }
};
//UPLOAD AGREEMENT
export const AuthorUploadAgreementController = async (c: Context) => {
  const { username, url }: { username: string; url: string } =
    await c.req.json();
  try {
    // PRISMA CONFIGURATIONS
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //UPLOAD AGREEMENT
    await prisma.author.update({
      where: {
        username,
      },
      data: {
        agreement: url,
      },
    });
    return c.json({ success: true, message: "Agreement Uploaded" });
  } catch (error) {
    throw error;
  }
};
