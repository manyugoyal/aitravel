import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function UserTripCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const API_KEY = "AIzaSyDEYoYidQ4EEVYxliPT9O_VEUW-6yxjeSE";

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const PHOTO_REF_URL = "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" + API_KEY;

  const GetPlacePhoto = async () => {
    const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;
    const requestData = {
      textQuery: trip?.userSelection?.place?.label,
    };
    try {
      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
        },
      });
      const photoName = response.data?.places?.[0]?.photos?.[3]?.name;
      if (photoName) {
        const finalUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(finalUrl);
      }
    } catch (error) {
      console.error("Failed to fetch photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/view-trip/${trip?.id}`} target='_blank' rel='noreferrer'>
      <motion.div className='rounded-2xl border border-gray-200 p-4 hover:border-blue-400 transition-shadow shadow-sm hover:shadow-lg bg-white' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
        <motion.div className='rounded-xl overflow-hidden mb-4 bg-gray-100' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {loading ? <div className='h-[300px] w-full bg-gray-200 animate-pulse rounded-xl' /> : <img src={photoUrl || "/placeholder.png"} alt='Trip' className='object-cover h-[300px] w-full' />}
        </motion.div>

        <div className='space-y-1 px-1'>
          <h2 className='font-semibold text-xl text-gray-800'>{trip?.userSelection?.place?.label}</h2>
          <p className='text-gray-600'>
            {trip?.userSelection?.noOfDays} Days Trip with ₹{trip?.userSelection?.budget} Budget
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default UserTripCard;
