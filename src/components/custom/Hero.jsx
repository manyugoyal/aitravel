import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#fefefe] to-[#f8fafc] dark:from-black dark:via-[#111827] dark:to-[#0f172a]">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center gap-10 text-center max-w-4xl mx-auto">
          
          {/* Heading */}
          <motion.h1
            className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f56551] to-[#ff9f1c]">
              Discover Your Next Adventure
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              with Smart AI Itineraries
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Let AI be your personal travel curator – build beautiful, customized plans that match your interests, budget, and pace.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/create-trip">
              <Button className="px-8 py-5 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-500 hover:to-purple-500 transition duration-200">
                Start Planning
              </Button>
            </Link>
          </motion.div>

          {/* Mockup Image */}
          <motion.div
            className="w-full mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <img
              src="/mg.jpg"
              alt="App mockup"
              className="w-full rounded-xl shadow-2xl ring-1 ring-gray-300 dark:ring-gray-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
