import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { MdOutlineSend, MdLocationOn, MdContentCopy, MdEmail } from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import { FaWallet, FaUserFriends, FaWhatsapp, FaTwitter, FaFacebook } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

function InfoSection({ trip }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  useEffect(() => {
    if (trip) {
      fetchPlacePhotos();
    }
  }, [trip]);

  const fetchPlacePhotos = async () => {
    setIsLoading(true);
    try {
      // Direct text search for photos - simpler approach
      const url = `https://places.googleapis.com/v1/places:searchText`;

      // Try with more specific search queries to get better photos
      const queries = [`${trip?.userSelection?.place?.label} tourist attractions`, `${trip?.userSelection?.place?.label} landmarks`, `${trip?.userSelection?.place?.label} tourism`];

      // Try multiple search terms to get better results
      let foundPhotos = [];

      for (const query of queries) {
        if (foundPhotos.length >= 6) break; // Stop if we have enough photos

        const requestData = { textQuery: query };

        const response = await axios.post(url, requestData, {
          params: { key: API_KEY },
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
          },
        });

        if (response.data.places) {
          // Collect photos from multiple places in results
          for (const place of response.data.places) {
            if (place.photos && place.photos.length > 0) {
              for (const photo of place.photos) {
                if (photo.name) {
                  const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=800&maxWidthPx=1200&key=${API_KEY}`;
                  foundPhotos.push(photoUrl);

                  // Stop if we have enough photos
                  if (foundPhotos.length >= 6) break;
                }
              }
            }
            if (foundPhotos.length >= 6) break;
          }
        }
      }

      if (foundPhotos.length > 0) {
        setPhotos(foundPhotos);
      } else {
        console.log("No photos found for", trip?.userSelection?.place?.label);
        // Set to empty array so we show placeholder
        setPhotos([]);
      }
    } catch (error) {
      console.error("Error fetching place photos:", error);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple carousel navigation
  const goToPrevious = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const shareUrl = window.location.href;
  const shareText = `Check out my ${trip?.userSelection?.noOfDays}-day trip to ${trip?.userSelection?.place?.label}!`;

  const shareTargets = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-sky-500",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Email",
      icon: MdEmail,
      color: "text-gray-600",
      href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  const openShareTarget = (href) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("Link copied to clipboard!");
    } catch (error) {
      toast("Couldn't copy the link. Please copy it manually.");
    }
  };

  return (
    <motion.div className='bg-white rounded-xl shadow-sm overflow-hidden' initial='hidden' animate='visible' variants={fadeIn} transition={{ duration: 0.6 }}>
      <div className='relative'>
        {/* Custom Carousel Implementation */}
        <div className='relative h-80 w-full overflow-hidden'>
          {isLoading ? (
            <div className='h-80 w-full bg-gray-200 flex items-center justify-center'>
              <motion.div className='w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full' animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
            </div>
          ) : photos.length > 0 ? (
            <>
              <div className='absolute inset-0 flex items-center justify-center'>
                <motion.img
                  key={currentPhotoIndex}
                  src={photos[currentPhotoIndex]}
                  alt={`${trip?.userSelection?.place?.label} - Photo ${currentPhotoIndex + 1}`}
                  className='h-full w-full object-cover'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    // If image fails to load, try the next one or show fallback
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              {/* Only show carousel controls if we have multiple photos */}
              {photos.length > 1 && (
                <>
                  {/* Left arrow button */}
                  <button onClick={goToPrevious} className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10' aria-label='Previous image'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                  </button>

                  {/* Right arrow button */}
                  <button onClick={goToNext} className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10' aria-label='Next image'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>

                  {/* Dot indicators */}
                  <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10'>
                    {photos.map((_, index) => (
                      <button key={index} onClick={() => setCurrentPhotoIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${currentPhotoIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/70"}`} aria-label={`Go to image ${index + 1}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            // Placeholder when no photos are available
            <div className='h-80 w-full bg-gray-100 flex flex-col items-center justify-center text-gray-500'>
              <svg className='w-16 h-16 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <p className='text-center'>No images available for {trip?.userSelection?.place?.label}</p>
            </div>
          )}
        </div>

        {/* Overlay gradient at bottom of carousel */}
        <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent'></div>
      </div>

      <div className='p-6'>
        <motion.div
          className='flex flex-col gap-4'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div className='flex justify-between items-center' variants={fadeIn}>
            <h2 className='font-bold text-2xl md:text-3xl text-gray-800 flex items-center'>
              <MdLocationOn className='text-red-500 mr-2' />
              {trip?.userSelection?.place?.label}
            </h2>

            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className='rounded-full p-3 h-12 w-12' aria-label='Share this trip'>
                    <MdOutlineSend className='text-xl' />
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className='w-64' align='end'>
                <p className='font-semibold text-sm text-gray-700 mb-3'>Share this trip</p>
                <div className='grid grid-cols-4 gap-3 mb-3'>
                  {shareTargets.map(({ name, icon: Icon, color, href }) => (
                    <button
                      key={name}
                      onClick={() => openShareTarget(href)}
                      className='flex flex-col items-center gap-1 group'
                      aria-label={`Share via ${name}`}
                    >
                      <span className='h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition'>
                        <Icon className={`text-xl ${color}`} />
                      </span>
                      <span className='text-[11px] text-gray-500'>{name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={copyShareLink}
                  className='w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg py-2 transition'
                >
                  <MdContentCopy /> Copy Link
                </button>
              </PopoverContent>
            </Popover>
          </motion.div>

          <motion.div className='mt-2 flex flex-wrap gap-3' variants={fadeIn}>
            <motion.div className='flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full' whileHover={{ scale: 1.05 }}>
              <IoMdCalendar className='mr-2' />
              <span className='font-medium'>
                {trip?.userSelection?.noOfDays} {trip?.userSelection?.noOfDays === 1 ? "Day" : "Days"}
              </span>
            </motion.div>

            <motion.div className='flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full' whileHover={{ scale: 1.05 }}>
              <FaWallet className='mr-2' />
              <span className='font-medium'>{trip?.userSelection?.budget}</span>
            </motion.div>

            <motion.div className='flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full' whileHover={{ scale: 1.05 }}>
              <FaUserFriends className='mr-2' />
              <span className='font-medium'>{trip?.userSelection?.traveller}</span>
            </motion.div>
          </motion.div>

          {trip?.tripData?.tripHighlights && (
            <motion.div className='mt-4 p-4 rounded-lg bg-gray-50' variants={fadeIn}>
              <h3 className='font-semibold text-lg mb-2'>Trip Highlights</h3>
              <p className='text-gray-700'>{trip?.tripData?.tripHighlights}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InfoSection;
