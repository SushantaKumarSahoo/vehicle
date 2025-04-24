import { motion, AnimatePresence } from "framer-motion";
import { Truck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll to section by id
  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    // Wait for menu to close before scrolling (for better UX)
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  return (
    <motion.header 
      className="bg-gradient-to-r from-purple-900 to-pink-800 text-white px-4 sm:px-6 py-4 sm:py-6 shadow-lg fixed w-full z-40 backdrop-blur-md bg-opacity-90"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.h1 
          className="text-xl sm:text-2xl font-bold flex items-center gap-2 active:scale-95 touch-manipulation"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" /> BuildFleet
        </motion.h1>

        <div className="flex items-center gap-4">
          {/* Navigation */}
          <AnimatePresence>
            <motion.nav
              className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-center gap-4 text-sm absolute sm:relative top-full sm:top-auto left-0 sm:left-auto right-0 sm:right-0 bg-gradient-to-r from-purple-900 to-pink-800 sm:bg-transparent w-full sm:w-auto p-4 sm:p-0`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {["Home", "Vehicles", "Contact"].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-orange-400 active:text-orange-400 active:scale-95 px-3 py-2 rounded-full hover:bg-purple-700 active:bg-purple-700 transition-all relative group backdrop-blur-sm bg-opacity-50 w-full sm:w-auto text-center sm:text-left touch-manipulation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: idx * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={e => {
                    e.preventDefault();
                    handleNavClick(item.toLowerCase());
                  }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-300"></span>
                </motion.a>
              ))}
            </motion.nav>
          </AnimatePresence>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="sm:hidden text-white active:scale-90 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}