import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderNav from "@/components/home/HeaderNav";
import ProgressBar from "@/components/home/ProgressBar";
import ScrollToTopButton from "@/components/home/ScrollToTopButton";
import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import FooterSection from "@/components/home/FooterSection";

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

const phrases = [
  "Fast construction vehicle rentals",
  "Reliable equipment for your projects",
  "Affordable rates for every budget",
  "24/7 availability and support",
  "Fully insured and maintained"
];

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [typingText, setTypingText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const navigate = useNavigate();

  // Typing animation effect with loop
  React.useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let currentPhrase = phrases[currentPhraseIndex];
    const typingInterval = setInterval(() => {
      if (!isDeleting && currentIndex <= currentPhrase.length) {
        setTypingText(currentPhrase.slice(0, currentIndex));
        currentIndex++;
        if (currentIndex === currentPhrase.length + 1) {
          isDeleting = true;
          setTimeout(() => {}, 2000);
        }
      } else if (isDeleting && currentIndex >= 0) {
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

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="scroll-snap">
      <ProgressBar />
      <ScrollToTopButton />
      <HeaderNav />
      <HeroSection
        typingText={typingText}
        search={search}
        setSearch={setSearch}
        navigate={navigate}
      />
      <VehiclesSection
        vehicles={vehicles}
        filteredVehicles={filteredVehicles}
        navigate={navigate}
      />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;