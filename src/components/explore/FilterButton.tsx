// src/components/ui/FilterButton.tsx
interface FilterButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  export default function FilterButton({ label, active, onClick }: FilterButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          active
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  }