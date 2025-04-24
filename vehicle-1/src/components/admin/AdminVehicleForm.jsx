import React from "react";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";

export default function AdminVehicleForm({
  newTitle,
  setNewTitle,
  newAvailability,
  setNewAvailability,
  newPrice,
  setNewPrice,
  newSpecs,
  setNewSpecs,
  handleAddVehicle,
}) {
  return (
    <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-4 sm:p-6 rounded-xl shadow-xl border-2 border-purple-200 mb-8 backdrop-blur-sm">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-purple-900 flex items-center gap-2">
        <Plus className="w-5 h-5 text-orange-500" />
        Add a New Vehicle
      </h3>
      <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Vehicle Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <select
          value={newAvailability}
          onChange={(e) => setNewAvailability(e.target.value)}
          className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
        <input
          type="number"
          placeholder="Price per day"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          required
          className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <textarea
          placeholder="Vehicle Specifications"
          value={newSpecs}
          onChange={(e) => setNewSpecs(e.target.value)}
          required
          className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Add Vehicle
        </Button>
      </form>
    </div>
  );
}