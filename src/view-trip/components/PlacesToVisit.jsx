import React from "react";
import PlaceCardItem from "./PlaceCardItem";
import { motion } from "framer-motion";

function PlacesToVisit({ trip }) {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='py-6'>
      <motion.h2 className='font-bold text-2xl mb-6 border-b pb-2' initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        Places to Visit
      </motion.h2>

      <motion.div variants={containerVariants} initial='hidden' animate='show'>
        {trip?.tripData?.itinerary?.map((item, index) => (
          <motion.div key={index} className='mb-8' variants={itemVariants}>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='font-bold text-xl bg-gray-100 px-4 py-2 rounded-lg'>DAY {item?.day}</h2>
              {item?.bestTimeToVisit && <span className='text-gray-600 text-sm'>Best time: {item?.bestTimeToVisit}</span>}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {item?.places.map((place, placeIndex) => (
                <motion.div
                  key={placeIndex}
                  className='border border-gray-200   rounded-xl transition-all duration-200 overflow-hidden'
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='bg-orange-50 py-2 px-4'>
                    <div className='flex items-center'>
                      <svg className='w-4 h-4 text-orange-500 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                      </svg>
                      <span className='font-medium text-sm text-orange-600'>Time To Travel: {place.timeToTravel}</span>
                    </div>
                  </div>
                  <div className='p-4'>
                    <PlaceCardItem place={place} index={placeIndex} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default PlacesToVisit;
