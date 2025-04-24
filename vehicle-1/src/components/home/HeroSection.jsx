import { motion } from "framer-motion";
import { Truck, Shield, Phone, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection({ typingText, search, setSearch, navigate }) {
  return (
    <motion.section 
    id="home"
      className="relative bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 py-12 sm:py-16 md:py-24 text-center px-4 pt-24 overflow-hidden min-h-screen flex items-center scroll-snap"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          poster="https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-excavator-working-on-a-construction-site-4280-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80"></div>
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10"></div>
      <motion.div 
        className="relative max-w-4xl mx-auto z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white px-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Rent the Best Construction Vehicles
        </motion.h2>
        <motion.p 
          className="text-base sm:text-lg mb-6 text-purple-100 max-w-2xl mx-auto min-h-[60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {typingText}
          <span className="animate-pulse">|</span>
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { icon: <Truck className="w-6 h-6" />, text: "24/7 Availability" },
            { icon: <Shield className="w-6 h-6" />, text: "Fully Insured" },
            { icon: <Phone className="w-6 h-6" />, text: "Quick Support" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-orange-400">{feature.icon}</span>
              <span className="text-sm sm:text-base">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="flex justify-center items-center gap-2 max-w-md mx-auto mb-6 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="text-orange-400 w-5 h-5" />
          <motion.input
            type="text"
            placeholder="Search vehicles..."
            className="w-full p-3 rounded-full border-2 border-orange-400 bg-white/10 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm active:scale-[0.99] transition-transform touch-manipulation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
          />
        </motion.div>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-purple-900 font-bold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm active:scale-95 touch-manipulation" onClick={() => navigate("/admin")}> 
              <Shield className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Admin
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-white hover:bg-purple-100 active:bg-purple-200 text-purple-900 font-bold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm active:scale-95 touch-manipulation" onClick={() => navigate("/client")}> 
              <User className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Client
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}