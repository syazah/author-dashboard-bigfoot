import { CgNametag } from "react-icons/cg";
import { AuthorType } from "../../pages/AdminAuthor";
import { BiBook } from "react-icons/bi";
import { GiEnergise } from "react-icons/gi";
import { MdDescription } from "react-icons/md";

function Book({ author }: { author: AuthorType }) {
  return (
    <div className="w-full h-[100vh]">
      <div className="w-full p-2 bg-zinc-800 text-xl font-semibold text-white border-b-[2px] border-yellow-600">
        Book Details
      </div>
      <div className="flex w-full h-full justify-start items-start">
        <div className="w-1/4 h-full flex flex-col justify-between items-start p-2">
          <img
            src={author.books[0].image}
            className="w-[250px] h-[300px] rounded-xl shadow-2xl"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col justify-start items-start gap-2 p-2">
          <h1 className="font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-yellow-600 w-full">
            <BiBook className="text-xl text-yellow-600" />{" "}
            {author.books[0].title}
          </h1>
          <h1 className="font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-yellow-600 w-full">
            <GiEnergise className="text-xl text-yellow-600" />
            {author.books[0].genre}
          </h1>
          <h1 className="font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-yellow-600 w-full">
            <MdDescription className="text-xl text-yellow-600" />
            {author.books[0].description}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Book;
