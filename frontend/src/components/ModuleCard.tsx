interface ModuleCardProps {
  title: string;
  count: number;
  onClick: () => void;
}

export default function ModuleCard({ title, count, onClick }: ModuleCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
      aria-label={`View ${title}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">
        {count} {count === 1 ? "item" : "items"}
      </p>
    </button>
  );
}
