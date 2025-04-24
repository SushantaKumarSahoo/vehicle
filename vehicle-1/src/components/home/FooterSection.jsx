import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-pink-800 text-white text-center py-8 sm:py-10 px-4 relative scroll-snap">
      {/* ...backgrounds... */}
      <div className="flex justify-center gap-4 sm:gap-6 mb-4 relative">
        {[Facebook, Instagram, Twitter].map((Icon, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9, rotate: 15 }} // Add tap effect for mobile
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 hover:text-white cursor-pointer" />
          </motion.div>
        ))}
      </div>
      <motion.p className="text-xs sm:text-sm relative">
        &copy; 2025 <span className="font-semibold text-orange-400">BuildFleet</span>. All rights reserved.
      </motion.p>
    </footer>
  );
}