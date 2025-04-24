import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ClientVehicleList({ filteredPosts, handleAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 relative z-20">
      {filteredPosts.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-sm sm:text-base text-purple-700 text-center p-4 bg-white/50 rounded-xl border-2 border-purple-200 backdrop-blur-sm"
        >
          No vehicles match the selected criteria.
        </motion.p>
      ) : (
        filteredPosts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-900">
              {post.title}
            </h3>
            <p className="text-sm sm:text-base mb-1 text-purple-700">
              Price: ₹{post.price}
            </p>
            <p className="text-sm sm:text-base mb-4 text-purple-700">
              Availability: {post.availability}
            </p>
            <Button
              onClick={() => handleAddToCart(post)}
              disabled={post.availability.toLowerCase() === "booked"}
              className={`w-full ${
                post.availability.toLowerCase() === "booked"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              }`}
            >
              {post.availability.toLowerCase() === "booked"
                ? "Unavailable"
                : "Add to Cart"}
            </Button>
          </motion.div>
        ))
      )}
    </div>
  );
}