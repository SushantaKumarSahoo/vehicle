import React from "react";
import { Button } from "@/components/common/Button";
import { Edit, Trash, Save, X, Truck, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminVehicleList({
  posts,
  filteredPosts,
  editingPostId,
  setEditingPostId,
  editTitle,
  setEditTitle,
  editAvailability,
  setEditAvailability,
  editPrice,
  setEditPrice,
  editSpecs,
  setEditSpecs,
  handleEditPost,
  handleDeletePost,
  availabilityFilter,
  setAvailabilityFilter,
  maxPrice,
  setMaxPrice,
  searchText,
  setSearchText,
}) {
  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl font-semibold mb-4 text-purple-900 flex items-center gap-2"
      >
        <Truck className="w-6 h-6 text-orange-500" />
        Available Construction Vehicles
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col sm:flex-row gap-4 bg-white/50 p-4 rounded-xl shadow-lg border-2 border-purple-200 backdrop-blur-sm"
      >
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
      </motion.div>

      {filteredPosts.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm sm:text-base text-purple-700 text-center p-4 bg-white/50 rounded-xl border-2 border-purple-200 backdrop-blur-sm"
        >
          No vehicles match the selected criteria.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 backdrop-blur-sm"
            >
              {editingPostId === post._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <select
                    className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                  <input
                    type="number"
                    className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                  <textarea
                    className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editSpecs}
                    onChange={(e) => setEditSpecs(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditPost(post._id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingPostId(null)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-bold text-base sm:text-lg text-purple-900">{post.title}</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditTitle(post.title);
                          setEditAvailability(post.availability);
                          setEditPrice(post.price);
                          setEditSpecs(post.specs);
                        }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeletePost(post._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-700">Availability: {post.availability}</p>
                  <p className="text-xs sm:text-sm text-purple-700">Price: ₹{post.price} / day</p>
                  <p className="text-sm sm:text-base text-purple-900">{post.specs}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}