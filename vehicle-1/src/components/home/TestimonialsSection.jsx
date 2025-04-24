import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialsSection({ testimonials }) {
  return (
    <motion.section className="bg-gradient-to-r from-purple-900 to-pink-800 py-12 sm:py-16 md:py-20 text-center px-4 relative min-h-[60vh] flex items-center scroll-snap">
      {/* ...backgrounds... */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h3 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white relative">
          What Our Clients Say
        </motion.h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
              <Quote className="text-orange-400 mb-4 mx-auto w-6 h-6 sm:w-8 sm:h-8" />
              <p className="italic text-sm sm:text-base text-purple-100 mb-2">"{testimonial.quote}"</p>
              <p className="font-semibold text-sm sm:text-base text-orange-400">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}