import { AuthorType } from "../../pages/AdminAuthor";
import { CgNametag } from "react-icons/cg";
import { BiBook, BiCategory, BiUser } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { BsGenderAmbiguous } from "react-icons/bs";

function Dashboard({ author }: { author: AuthorType }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full p-2 flex flex-col justify-start items-start">
        <h1 className="text-2xl font-semibold">
          Hello {author.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-zinc-400">
          This is your admin dashboard provided by the Bigfoot Publications
        </p>
        <div className="w-full h-full flex p-10 bg-zinc-900 rounded-xl mt-2">
          <div className="w-1/4 h-full flex flex-col justify-between items-start">
            <img
              src={author.profilePic}
              className="w-[200px] h-[200px] rounded-full"
            />
          </div>
          <div className="w-3/4 h-full flex flex-col justify-start items-start gap-2">
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <CgNametag className="text-xl text-yellow-600" /> {author.name}
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <BsGenderAmbiguous className="text-xl text-yellow-600" />{" "}
              {author.gender}
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <BiUser className="text-xl text-yellow-600" /> @{author.username}
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <MdEmail className="text-xl text-yellow-600" /> {author.email}
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <BiBook className="text-xl text-yellow-600" /> Published{" "}
              {author.books.length} Book
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <BiCategory className="text-xl text-yellow-600" /> Genres Written:{" "}
              {author.books.map((book) => book.genre)}
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 border-b-[1px] border-zinc-300 w-full">
              <TfiWrite className="text-xl text-yellow-600" /> Authored:{" "}
              {author.books.map((book) => book.title)}
            </h1>
            <h1 className="text-white font-semibold border-b-[1px] border-yellow-600 text-lg flex justify-start items-center gap-1 w-full">
              BIO:
            </h1>
            <h1 className="text-white font-normal text-lg flex justify-start items-center gap-1 w-full">
              {author.bio}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
