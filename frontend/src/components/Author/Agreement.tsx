import { useState } from "react";

function Agreement({ agreement }: { agreement: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2">
      <div className="w-full flex justify-start items-center border-b-[2px] border-yellow-600 text-xl font-semibold p-1">
        <img className="w-8 h-8" src={"/LOGO.png"}/>
        Author Agreement
      </div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <iframe
          onLoadStart={() => {
            setLoading(true);
          }}
          src={agreement}
          className="w-full h-full border-none"
          title="User Agreement PDF"
          onLoadedData={() => {
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}
export default Agreement;
