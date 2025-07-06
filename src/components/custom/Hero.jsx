import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <div className='container mx-auto px-4 py-12 md:py-20'>
      <div className='flex flex-col items-center gap-8 max-w-4xl mx-auto'>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='text-center'>
          <motion.h1 className='font-extrabold text-3xl md:text-4xl lg:text-5xl text-center leading-tight' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <motion.span className='text-[#f56551] inline-block' whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              Discover Your Next Adventure with AI:
            </motion.span>
            <br />
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
              Personalised Itineraries at Your Fingertips
            </motion.span>
          </motion.h1>

          <motion.p className='text-base md:text-lg lg:text-xl text-gray-600 mt-6 max-w-2xl mx-auto hidden sm:block' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
            Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to='/create-trip'>
            <Button className='px-8 py-6 text-base md:text-lg rounded-full font-medium'>Get Started</Button>
          </Link>
        </motion.div>

        <motion.div className='w-full mt-8 md:mt-12 px-4 md:px-10 lg:px-16' initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 50 }} whileHover={{ y: -5 }}>
          <img src='/mockup-2.png' alt='App mockup' className='w-full rounded-xl shadow-2xl' />
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
