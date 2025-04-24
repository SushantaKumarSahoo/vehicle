import { Search } from "lucide-react";

export default function ClientFilterBar({
  availabilityFilter,
  setAvailabilityFilter,
  maxPrice,
  setMaxPrice,
  searchText,
  setSearchText,
}) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4 bg-white/50 p-4 rounded-xl shadow-lg border border-purple-200 relative z-10">
      <select
        value={availabilityFilter}
        onChange={(e) => setAvailabilityFilter(e.target.value)}
        className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
      </select>

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border-2 border-purple-200 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}