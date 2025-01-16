import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const Auth = lazy(() => import("./pages/Auth"));
const Author = lazy(() => import("./pages/Author"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminAuthor = lazy(() => import("./pages/AdminAuthor"));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Auth />} />
        <Route path={"/author/:id"} element={<Author />} />
        <Route path={"/auth/admin"} element={<AdminAuth />} />
        <Route path={"/admin/:id"} element={<Admin />} />
        <Route path={"/admin/author/:id"} element={<AdminAuthor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
