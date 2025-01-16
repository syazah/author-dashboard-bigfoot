type AuthorType = {
  username: string;
  email: string;
  id: string;
  name: string;
  books: string[];
};
function Dashboard({ author }: { author: AuthorType }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2 flex justify-start items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">
            Hello {author.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-zinc-400">
            This is your admin dashboard provided by the Bigfoot Publications
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
