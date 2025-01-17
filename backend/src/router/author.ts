import { Hono } from "hono";
import {
  AuthorSignUpController,
  AuthorLoginController,
  AuthorDetailsController,
  AllAuthorsController,
  SearchAuthorController,
  AuthorUpdateDetailController,
  AuthorExcelUploadController,
  AuthorUploadAgreementController,
} from "../controller/author";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

//AUTH ROUTES
app.post("/signup", AuthorSignUpController);
app.post("/login", AuthorLoginController);
//GET AUTHOR
app.get("/all", AllAuthorsController);
app.get("/search", SearchAuthorController);
app.get("/:id", AuthorDetailsController);
//UPLOAD
app.post("/upload-excel", AuthorExcelUploadController);
app.post("/upload-agreement", AuthorUploadAgreementController);
//UPDATE AUTHOR DETAILS
app.patch("/:authorId/update", AuthorUpdateDetailController);

export default app;
