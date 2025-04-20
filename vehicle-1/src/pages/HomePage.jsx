import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Search, Phone, Shield, User, Facebook, Instagram, Twitter, Quote, ArrowUp, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const vehicles = [
  { name: "Excavator", image: "https://images.unsplash.com/photo-1630288214173-a119cf823388?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: "$250/day" },
  { name: "Bulldozer", image: "https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: "$300/day" },
  { name: "Crane", image: "https://images.unsplash.com/photo-1566766804405-eed274ee46bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: "$400/day" },
];

const testimonials = [
  { name: "Alex Johnson", quote: "BuildFleet made our project seamless with their reliable equipment and prompt service." },
  { name: "Maria Lopez", quote: "Fantastic experience! Renting was easy and the vehicle quality exceeded expectations." },
  { name: "James Carter", quote: "Professional, affordable, and quick support whenever we needed it." },
];

const App = () => {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const phrases = [
    "Fast construction vehicle rentals",
    "Reliable equipment for your projects",
    "Affordable rates for every budget",
    "24/7 availability and support",
    "Fully insured and maintained"
  ];

  // Typing animation effect with loop
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let currentPhrase = phrases[currentPhraseIndex];
    
    const typingInterval = setInterval(() => {
      if (!isDeleting && currentIndex <= currentPhrase.length) {
        // Typing
        setTypingText(currentPhrase.slice(0, currentIndex));
        currentIndex++;
        if (currentIndex === currentPhrase.length + 1) {
          isDeleting = true;
          setTimeout(() => {}, 2000); // Pause at the end
        }
      } else if (isDeleting && currentIndex >= 0) {
        // Deleting
        setTypingText(currentPhrase.slice(0, currentIndex));
        currentIndex--;
        if (currentIndex === 0) {
          isDeleting = false;
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          currentPhrase = phrases[(currentPhraseIndex + 1) % phrases.length];
        }
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentPhraseIndex]);

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const vehiclesY = useTransform(scrollY, [0, 1000], [0, -200]);
  const testimonialsY = useTransform(scrollY, [0, 1500], [0, -150]);
  const contactY = useTransform(scrollY, [0, 2000], [0, -100]);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Add modern scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      /* Modern Scrollbar */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(147, 51, 234, 0.1);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #9333ea, #ec4899, #f97316);
        border-radius: 10px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #7e22ce, #db2777, #ea580c);
        box-shadow: 0 0 15px rgba(147, 51, 234, 0.7);
      }
      
      /* Firefox Scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #9333ea rgba(147, 51, 234, 0.1);
      }
      
      /* Smooth Scroll Behavior */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 80px;
      }
      
      /* Scroll Snap */
      .scroll-snap {
        scroll-snap-type: y proximity;
      }
      
      .scroll-snap > section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }
    `;
    document.head.appendChild(style);
    
    // Show scroll to top button when scrolling down
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="scroll-snap">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 z-50"
        style={{ scaleX }}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl z-50 transition-all duration-300 hover:scale-110 backdrop-blur-sm bg-opacity-80"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
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
                    onClick={() => setIsMenuOpen(false)}
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

      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 py-12 sm:py-16 md:py-24 text-center px-4 pt-24 overflow-hidden min-h-screen flex items-center scroll-snap"
        style={{ y: heroY, opacity: heroOpacity }}
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

          {/* Additional Features */}
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

      {/* Vehicles */}
      <motion.section 
        id="vehicles" 
        className="py-12 sm:py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-purple-50 to-pink-50 relative overflow-hidden scroll-snap"
        style={{ y: vehiclesY }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1630288214173-a119cf823388?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 to-pink-50/90"></div>
        <div className="relative z-10">
          <motion.h3 
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-purple-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
                whileTap={{ scale: 0.97 }}
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
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-4 sm:p-6 bg-gradient-to-b from-white/90 to-purple-50/90 backdrop-blur-sm">
                    <h4 className="text-lg sm:text-xl font-semibold mb-1 text-purple-900">{vehicle.name}</h4>
                    <p className="text-sm sm:text-base text-purple-600 font-medium">{vehicle.price}</p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-purple-900 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm active:scale-95 touch-manipulation" onClick={() => navigate("/client")}>Rent Now</Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="bg-gradient-to-r from-purple-900 to-pink-800 py-12 sm:py-16 md:py-20 text-center px-4 relative min-h-[60vh] flex items-center scroll-snap"
        style={{ y: testimonialsY }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566766804405-eed274ee46bf?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-800/50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h3 
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Clients Say
          </motion.h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Quote className="text-orange-400 mb-4 mx-auto w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300" />
                <p className="italic text-sm sm:text-base text-purple-100 mb-2">"{testimonial.quote}"</p>
                <p className="font-semibold text-sm sm:text-base text-orange-400">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section 
        id="contact" 
        className="bg-gradient-to-b from-white to-purple-50 py-12 sm:py-16 text-center px-4 relative min-h-[50vh] flex items-center scroll-snap"
        style={{ y: contactY }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-purple-50/90"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h3 
            className="text-2xl sm:text-3xl font-bold mb-4 text-purple-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Need Help?
          </motion.h3>
          <motion.p 
            className="mb-6 text-sm sm:text-base text-purple-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Call us at <strong className="text-orange-600">+1 800 555 0123</strong> or fill out the contact form.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-purple-900 font-bold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm active:scale-95 touch-manipulation">
              <Phone className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Contact Us
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-800 text-white text-center py-8 sm:py-10 px-4 relative scroll-snap">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-800/50"></div>
        
        <div className="flex justify-center gap-4 sm:gap-6 mb-4 relative">
          {[Facebook, Instagram, Twitter].map((Icon, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 hover:text-white cursor-pointer transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
        <motion.p 
          className="text-xs sm:text-sm relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          &copy; 2025 <span className="font-semibold text-orange-400">BuildFleet</span>. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default App;