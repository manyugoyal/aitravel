import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { FaMapLocation } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function PlaceCardItem({ place, index = 0 }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const API_KEY = "AIzaSyDEYoYidQ4EEVYxliPT9O_VEUW-6yxjeSE";
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (place) {
      getPlacePhoto();
    }
  }, [place, retryCount]);

  const PHOTO_REF_URL = "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" + API_KEY;

  const getRandomPlaceholder = () => {
    // Generate a random width and height for variety
    const width = Math.floor(Math.random() * 200) + 300; // 300-500px width
    const height = Math.floor(Math.random() * 200) + 200; // 200-400px height
    return `https://picsum.photos/${width}/${height}`;
  };

  const getPlacePhoto = async () => {
    setIsLoading(true);
    try {
      const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;
      const requestData = {
        textQuery: place?.placeName,
      };

      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
        },
      });

      if (response.data.places && response.data.places[0]?.photos?.length > 0) {
        // Safely access the first photo
        const photoName = response.data.places[0].photos[0].name;
        const photoURL = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(photoURL);
      } else {
        // No photos found, use placeholder
        setPhotoUrl(getRandomPlaceholder());
      }
    } catch (error) {
      console.error(`Error fetching place photo (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);

      if (retryCount < MAX_RETRIES - 1) {
        // Implement exponential backoff for retries
        const backoffTime = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, backoffTime);
      } else {
        // Max retries reached, use placeholder
        setPhotoUrl("/images.png");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the map query to include proper place name
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName || "")}`;

  return (
    <motion.div
      className='rounded-lg p-4 flex flex-col cursor-pointer bg-white shadow-sm'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <motion.div className='relative overflow-hidden rounded-lg mb-3' whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        {isLoading ? (
          <div className='h-48 w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center'>
            <span className='text-gray-400'>Loading...</span>
          </div>
        ) : (
          <img src={photoUrl == "/images.png" ? '/images.png' : photoUrl} alt={place?.placeName || "Place"} className='h-48 w-full object-cover rounded-lg' onError={() => setPhotoUrl(getRandomPlaceholder())} />
        )}
      </motion.div>

      <div className='flex flex-col gap-2'>
        <h2 className='font-bold text-lg text-gray-800'>{place?.placeName}</h2>
        <p className='text-sm text-gray-600 line-clamp-2'>{place?.placeDetails}</p>

        <div className='mt-2 flex items-center'>
          <span className='font-semibold text-gray-800'>💵 {place?.ticketPricing}</span>
        </div>

        <div className='mt-4'>
          <Link to={mapUrl} target='_blank' rel='noreferrer' className='no-underline'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className='flex items-center gap-2 w-full'>
                <FaMapLocation className='mr-1' />
                <span>View Location</span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default PlaceCardItem;
