import { Netease } from "@/components/brand/netease";

const Home = () => {
  return (
    <div className="flex flex-col h-screen p-3 items-center">
      <h1 className="text-2xl font-light">Welcome to Tune Bridge</h1>

      <div className="flex">
        <Netease />
      </div>
    </div>
  );
};

export default Home;
