import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function VehiclesSection({ vehicles, filteredVehicles }) {
  const navigate = useNavigate();
  return (
    <motion.section
      id="vehicles"
      className="py-12 sm:py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-purple-50 to-pink-50 relative overflow-hidden scroll-snap"
    >
      {/* ...backgrounds... */}
      <div className="relative z-10">
        <motion.h3
          className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-purple-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Available Vehicles
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {filteredVehicles.map((vehicle, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, rotate: [0, 1, -1, 0] }}
              whileTap={{ scale: 0.97, rotate: 2 }} // Tap effect for mobile
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="transition-transform touch-manipulation"
            >
              <Card className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl active:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 group-active:scale-105 transition-transform duration-500"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }} // Tap effect for mobile
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <CardContent className="p-4 sm:p-6 bg-gradient-to-b from-white/90 to-purple-50/90 backdrop-blur-sm">
                  <h4 className="text-lg sm:text-xl font-semibold mb-1 text-purple-900">
                    {vehicle.name}
                  </h4>
                  <p className="text-sm sm:text-base text-purple-600 font-medium">
                    {vehicle.price}
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="mt-4 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-purple-900 font-bold text-sm sm:text-base"
                      onClick={() => navigate("/client")}
                    >
                      Rent Now
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}