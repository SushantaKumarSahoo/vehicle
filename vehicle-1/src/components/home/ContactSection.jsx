import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <motion.section id="contact" className="bg-gradient-to-b from-white to-purple-50 py-12 sm:py-16 text-center px-4 relative min-h-[50vh] flex items-center scroll-snap">
      {/* ...backgrounds... */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h3 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-900">
          Need Help?
        </motion.h3>
        <motion.p className="mb-6 text-sm sm:text-base text-purple-700">
          Call us at <strong className="text-orange-600">+1 800 555 0123</strong> or fill out the contact form.
        </motion.p>
        <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-purple-900 font-bold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base">
          <Phone className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Contact Us
        </Button>
      </div>
    </motion.section>
  );
}