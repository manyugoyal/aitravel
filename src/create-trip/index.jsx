
import { AI_PROMPTS, SelectBudgetOptions, SelectTravelsList } from "../constants/option";
import { Input } from "../components/ui/input";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { chatSession } from "../service/AIModel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { db } from "../service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlane, FaMapMarkedAlt, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { GiDuration } from "react-icons/gi";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      getUserProfile(response);
    },
    onError: (error) => console.log(error),
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (formData?.noOfDays && parseInt(formData.noOfDays) > 5) {
      toast("Please choose less than 5 days");
      return;
    } else if (!formData?.place || !formData?.budget || !formData?.traveller) {
      toast("Please fill all the fields");
      return;
    }
    setLoading(true);
    const FINAL_PROMT = AI_PROMPTS.replace("{location}", formData?.place?.label || "")
      .replace("{totalDays}", formData?.noOfDays || "")
      .replace("{traveler}", formData?.traveller || "")
      .replace("{budget}", formData?.budget || "")
      .replace("{totalDays}", formData?.noOfDays || "");

    try {
      const result = await chatSession.sendMessage(FINAL_PROMT);
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      toast("Error generating trip. Please try again.");
      setLoading(false);
    }
  };

  function extractJSON(input) {
    if (typeof input === "object") return input;

    if (typeof input === "string") {
      const backtickMatch = input.match(/```json([\s\S]*?)```/);
      if (backtickMatch) {
        try {
          return JSON.parse(backtickMatch[1].trim());
        } catch (error) {
          console.error("Error parsing JSON from backticks:", error);
          return null;
        }
      }

      try {
        return JSON.parse(input);
      } catch (error) {
        console.error("Error parsing direct JSON:", error);
        return null;
      }
    }
    console.error("No valid JSON could be extracted");
    return null;
  }

  const SaveAiTrip = async (result) => {
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const Json_res = extractJSON(result);
    if (!Json_res) {
      toast("Please try to generate the trip again");
      setLoading(false);
      return;
    }

    await setDoc(doc(db, "AITrips", docId), {
      id: docId,
      userSelection: formData,
      tripData: Json_res,
      userEmail: user?.email,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  const getUserProfile = (token) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token?.access_token}`, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((error) => {
        toast("Authentication failed. Please try again.");
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    }),
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.place) {
      toast("Please select a destination");
      return;
    }
    if (currentStep === 1 && (!formData.noOfDays || parseInt(formData.noOfDays) > 5)) {
      toast("Please enter a valid duration (max 5 days)");
      return;
    }
    if (currentStep === 2 && !formData.budget) {
      toast("Please select a budget");
      return;
    }
    if (currentStep === 3 && !formData.traveller) {
      toast("Please select who's traveling");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onGenerateTrip();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const direction = 1;

    switch (currentStep) {
      case 0:
        return (
          <motion.div key='step0' custom={direction} variants={slideVariants} initial='enter' animate='center' exit='exit' className='w-full'>
            <motion.div variants={itemVariants} className='bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-full bg-blue-100 text-blue-600'>
                  <FaMapMarkedAlt className='text-xl' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Where are you heading?</h3>
              </div>
              <div className='relative'>
                <GooglePlacesAutocomplete
                  apiKey='AIzaSyDMkZJSXUDbwzxjwQqek0S9-cxK_CRAIyg'
                  selectProps={{
                    place,
                    onChange: (v) => {
                      setPlace(v);
                      handleInputChange("place", v);
                    },
                    placeholder: "Search destinations...",
                    className: "w-full z-50",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#3b82f6",
                        },
                      }),
                      input: (provided) => ({
                        ...provided,
                        fontSize: "16px",
                      }),
                    },
                  }}
                />
                <motion.div 
                  className='absolute -right-4 -bottom-4 text-blue-500 opacity-20' 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FaMapMarkedAlt size={80} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div key='step1' custom={direction} variants={slideVariants} initial='enter' animate='center' exit='exit' className='w-full'>
            <motion.div variants={itemVariants} className='bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-full bg-purple-100 text-purple-600'>
                  <GiDuration className='text-xl' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Trip Duration</h3>
              </div>
              <div className='relative'>
                <Input
                  placeholder='Number of days (max 5)'
                  type='number'
                  max={5}
                  min={1}
                  value={formData.noOfDays || ""}
                  className='w-full text-lg p-6 rounded-xl border-gray-200 focus-visible:ring-blue-500 focus-visible:ring-2'
                  onChange={(e) => {
                    handleInputChange("noOfDays", e.target.value);
                  }}
                />
                <motion.div className='w-full mt-6 h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <motion.div
                    className='h-full bg-gradient-to-r from-purple-500 to-blue-500'
                    initial={{ width: 0 }}
                    animate={{
                      width: formData.noOfDays ? `${Math.min(parseInt(formData.noOfDays) * 20, 100)}%` : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                <p className='text-right text-sm text-gray-500 mt-2'>
                  {formData.noOfDays ? `${formData.noOfDays} day${parseInt(formData.noOfDays) !== 1 ? "s" : ""}` : "Select days"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key='step2' custom={direction} variants={slideVariants} initial='enter' animate='center' exit='exit' className='w-full'>
            <motion.div variants={itemVariants} className='bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-full bg-green-100 text-green-600'>
                  <FaMoneyBillWave className='text-xl' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Choose Your Budget</h3>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {SelectBudgetOptions.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover='hover'
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`
                      p-6 border rounded-xl text-center cursor-pointer transition duration-300
                      ${formData?.budget === item.title ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}
                    `}
                  >
                    <motion.div 
                      className='text-5xl mb-4 flex justify-center' 
                      whileHover={{ scale: 1.2, rotate: 5 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h4 className='font-bold text-lg'>{item.title}</h4>
                    <p className='text-sm text-gray-500 mt-2'>{item.desc}</p>
                    {formData?.budget === item.title && (
                      <motion.div 
                        className='w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 mt-3 rounded-full' 
                        layoutId='budgetIndicator' 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key='step3' custom={direction} variants={slideVariants} initial='enter' animate='center' exit='exit' className='w-full'>
            <motion.div variants={itemVariants} className='bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-full bg-orange-100 text-orange-600'>
                  <FaUsers className='text-xl' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Who's Traveling?</h3>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {SelectTravelsList.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover='hover'
                    onClick={() => handleInputChange("traveller", item.title)}
                    className={`
                      p-6 border rounded-xl text-center cursor-pointer transition duration-300
                      ${formData?.traveller === item.title ? "border-orange-500 bg-orange-50 ring-2 ring-orange-300" : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"}
                    `}
                  >
                    <motion.div 
                      className='text-5xl mb-4 flex justify-center' 
                      whileHover={{ scale: 1.2, rotate: 5 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h4 className='font-bold text-lg'>{item.title}</h4>
                    <p className='text-sm text-gray-500 mt-2'>{item.desc}</p>
                    {formData?.traveller === item.title && (
                      <motion.div 
                        className='w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mt-3 rounded-full' 
                        layoutId='travellerIndicator' 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4"
    >
      <div className='container mx-auto max-w-5xl'>
        <motion.div 
          className='text-center mb-12' 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        >
          <motion.div
            className='flex justify-center mb-4'
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FaPlane className='text-blue-600 text-5xl' />
          </motion.div>

          <h2 className='text-5xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>
            Plan Your Perfect Trip
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Share your travel preferences, and our AI will craft a personalized itinerary just for you.
          </p>
        </motion.div>

        <motion.div 
          className='mb-8' 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.4 }}
        >
          <div className='flex justify-between items-center mb-6 relative'>
            <div className='absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10 mx-16'></div>
            {[0, 1, 2, 3].map((step) => (
              <motion.div 
                key={step} 
                className='flex flex-col items-center relative' 
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    currentStep >= step 
                      ? "bg-gradient-to-br from-blue-600 to-purple-600" 
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                  animate={{
                    scale: currentStep === step ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {step + 1}
                </motion.div>
                <motion.div 
                  className={`mt-3 text-sm font-medium ${
                    currentStep >= step 
                      ? "text-gray-800 font-semibold" 
                      : "text-gray-500"
                  }`}
                >
                  {step === 0 ? "Destination" : step === 1 ? "Duration" : step === 2 ? "Budget" : "Travelers"}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial='hidden' 
          animate='visible' 
          className='space-y-8'
        >
          {renderStep()}

          <motion.div 
            className='flex justify-between mt-8' 
            variants={itemVariants}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className={`px-8 py-3 rounded-xl flex items-center space-x-2 ${
                currentStep > 0 
                  ? "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`} 
              onClick={prevStep} 
              disabled={currentStep === 0}
            >
              <span>Back</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className='
                bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl 
                hover:from-blue-700 hover:to-purple-700 transition duration-300 
                flex items-center justify-center space-x-2 shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
              '
              disabled={loading}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin' />
                  <span>Generating...</span>
                </>
              ) : currentStep < 3 ? (
                "Continue"
              ) : (
                "Generate My Trip"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Google Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-md rounded-2xl border-0 shadow-xl'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold text-gray-800'>
              Welcome Traveler!
            </DialogTitle>
            <DialogDescription>
              <motion.div 
                className='flex flex-col items-center space-y-6 py-6' 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <motion.img 
                  src='/logo4.png' 
                  alt='Logo' 
                  className='w-40 h-40 rounded-xl shadow-md border border-gray-200' 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ delay: 0.4, type: "spring" }} 
                />
                <motion.div 
                  className='text-center' 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.6 }}
                >
                  <h2 className='text-xl font-bold mb-2'>Sign in with Google</h2>
                  <p className='text-gray-600 mb-6'>Continue your journey with secure Google Authentication</p>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={login} 
                      className='w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all py-6 rounded-xl'
                    >
                      <img 
                        src='https://www.google.com/favicon.ico' 
                        alt='Google' 
                        className='h-5 w-5 mr-3'
                      />
                      <span className='font-medium'>Sign in with Google</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog open={loading} onOpenChange={setLoading}>
        <DialogContent className='max-w-md rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
          <DialogHeader>
            <DialogDescription>
              <motion.div 
                className='flex flex-col items-center justify-center min-h-[400px] space-y-6' 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
              >
                <motion.h2 
                  className='text-3xl font-bold text-gray-800 text-center' 
                  initial={{ y: -20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                >
                  Crafting Your Adventure
                </motion.h2>
                <motion.p 
                  className='text-lg text-gray-600 text-center max-w-md' 
                  initial={{ y: -20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.4 }}
                >
                  Our AI is weaving together a personalized travel experience tailored just for you.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.6 }}
                >
                  <motion.div 
                    className='h-40 w-40 relative' 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div 
                      className='absolute inset-0 rounded-full border-t-4 border-blue-600 opacity-75' 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} 
                    />
                    <motion.div 
                      className='absolute inset-4 rounded-full border-t-4 border-blue-400 opacity-75' 
                      animate={{ rotate: -360 }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                    />
                    <motion.div 
                      className='absolute inset-8 rounded-full border-t-4 border-blue-300 opacity-75' 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} 
                    />
                    <motion.div
                      className='absolute inset-0 flex items-center justify-center'
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaPlane className='text-blue-600 text-4xl' />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.p 
                  className='text-sm text-gray-500 italic text-center' 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.8 }}
                >
                  Sit back and get ready to explore!
                </motion.p>
              </motion.div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default CreateTrip;