import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function HotelCard({ item, index }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const API_KEY = "AIzaSyDEYoYidQ4EEVYxliPT9O_VEUW-6yxjeSE";
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (item) {
      getPlacePhoto();
    }
  }, [item]);

  // Effect to handle retries
  useEffect(() => {
    if (retryCount > 0 && retryCount <= MAX_RETRIES && photoUrl) {
      console.log(`Retry attempt ${retryCount} for ${item?.hotelName}`);
      // Short delay before retry
      const retryTimer = setTimeout(() => {
        fetchAlternatePhoto();
      }, 1000);

      return () => clearTimeout(retryTimer);
    }
  }, [retryCount]);

  const PHOTO_REF_URL = "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" + API_KEY;

  const getPlacePhoto = async () => {
    setIsLoading(true);
    try {
      const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;
      const requestData = {
        textQuery: item?.hotelName,
      };

      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
        },
      });

      if (response.data.places && response.data.places[0]?.photos?.length > 0) {
        // Safely access photo - use the first available photo or fall back to index 0
        const photoIndex = response.data.places[0].photos.length > 3 ? 3 : 0;
        const photoName = response.data.places[0].photos[photoIndex].name;
        const photoURL = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(photoURL);

        // We'll handle the loading state in the onLoad/onError of the image
        // Add minimum delay of 1 second before checking image
        setTimeout(() => {
          checkImageLoad(photoURL);
        }, 1000);
      } else {
        console.log(`No photos found for ${item?.hotelName}, using placeholder`);
        // No photos found, finish loading with delay
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching hotel photo:", error);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const fetchAlternatePhoto = async () => {
    try {
      const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;
      const requestData = {
        textQuery: `${item?.hotelName} ${item?.hotelAddress}`,
      };

      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
        },
      });

      if (response.data.places && response.data.places[0]?.photos?.length > 0) {
        // Try a different photo index this time
        const photoIndex = Math.min(retryCount, response.data.places[0].photos.length - 1);
        const photoName = response.data.places[0].photos[photoIndex].name;
        const photoURL = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(photoURL);

        // Check if this image loads properly
        checkImageLoad(photoURL);
      } else {
        // If still no photos, give up and finish loading
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching alternate hotel photo:", error);
      setIsLoading(false);
    }
  };

  // Function to check if image loads properly
  const checkImageLoad = (url) => {
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully
      console.log(`Image for ${item?.hotelName} loaded successfully`);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Additional 1s delay after successful load for smooth transition
    };

    img.onerror = () => {
      console.error(`Failed to load image for ${item?.hotelName}`);
      // If we haven't reached max retries, try again with different image
      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
      } else {
        console.log(`Max retries reached for ${item?.hotelName}, using placeholder`);
        setIsLoading(false);
      }
    };

    img.src = url;
  };

  // Fix the duplicate address in query parameter
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item?.hotelAddress)}`;

  // Image loaded handler for the visible image component
  const handleImageLoad = () => {
    console.log(`Visible image for ${item?.hotelName} rendered successfully`);
  };

  // Image error handler for the visible component
  const handleImageError = () => {
    console.error(`Visible image for ${item?.hotelName} failed to render`);
    // If this happens, we'll fall back to the placeholder via the "|| '/placeholder.png'" in the src
  };

  return (
    <Link to={mapUrl} target='_blank' rel='noreferrer' key={index}>
      <motion.div
        className='rounded-lg p-4 flex flex-col cursor-pointer bg-white relative overflow-hidden'
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
            delay: index * 0.1,
          },
        }}
        whileHover={{
          scale: 1.04,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Animated background glow effect on hover */}
        <AnimatePresence>{isHovered && <motion.div className='absolute inset-0 rounded-lg' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />}</AnimatePresence>

        <motion.div className='relative overflow-hidden rounded-lg mb-4' whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
          {isLoading ? (
            <div className='h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center'>
              <motion.div className='w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full' animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
            </div>
          ) : (
            <motion.div className='relative h-48 w-full'>
              <motion.img src={photoUrl || "/placeholder.png"} alt={item?.hotelName || "Hotel"} className='h-full w-full object-cover rounded-lg' initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} onLoad={handleImageLoad} onError={handleImageError} />

              <motion.div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg opacity-0' animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} />

              <motion.div className='absolute inset-0 flex items-end p-3' initial={{ opacity: 0, y: 20 }} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }} transition={{ duration: 0.3 }}>
                <motion.div className='bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
                  </svg>
                  <span className='text-sm font-medium'>View on Maps</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        <motion.div className='flex flex-col gap-2 z-10' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <motion.h2 className='font-bold text-lg text-gray-800' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
            {item?.hotelName}
          </motion.h2>

          <motion.div className='flex items-center text-gray-500 text-sm' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }}>
            <motion.span className='mr-1 text-red-500' animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5, times: [0, 0.5, 1] }}>
              📍
            </motion.span>
            <span className='truncate'>{item?.hotelAddress}</span>
          </motion.div>

          <motion.div className='flex justify-between items-center mt-1' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
            <motion.span className='font-semibold text-gray-800' whileHover={{ color: "#3B82F6" }}>
              {item?.price}
            </motion.span>
            <motion.div className='flex items-center' whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <motion.span
                className='mr-1 text-yellow-500'
                animate={{
                  rotate: isHovered ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5, times: [0, 0.3, 0.6, 1], delay: 0.2 }}
              >
                ⭐
              </motion.span>
              <span className='font-medium'>{item?.rating}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default HotelCard;
