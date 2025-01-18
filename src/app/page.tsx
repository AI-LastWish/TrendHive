import DateFilterWrapper from "../components/DateFilterWrapper";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* DateFilter handles its own data fetching */}
        <DateFilterWrapper />
      </div>
    </div>
  );
};

export default Home;
