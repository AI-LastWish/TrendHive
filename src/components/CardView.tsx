interface CardItem {
  title: string;
  description: string;
  date: string; // ISO date string or formatted date
}

const CardView = ({ data }: { data: CardItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.map((item, index) => (
      <div key={index} className="border rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p>{item.description}</p>
        <span className="text-sm text-gray-500">{item.date}</span>
      </div>
    ))}
  </div>
);

export default CardView;
