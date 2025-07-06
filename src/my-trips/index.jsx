import { db } from "../service/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import UserTripCard from "./components/UserTripCard";

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);
  useEffect(() => {
    GetUserTrips();
  }, []);
  const navigate = useNavigation();

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    setUserTrips([]);
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user.email),
      orderBy("createdAt", "desc"),
      limit(9) // Sorting by newest trips first
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());

      setUserTrips((prev) => [...prev, doc.data()]);
    });
  };
  return (
    <div>
      <h2 className='p-10 md:px-20 text-center text-3xl font-bold'>Latest Trips </h2>

      <div className='mx-10 grid grid-cols-1 md:grid-cols-3 gap-5'>{userTrips.length > 0 ? userTrips.map((trip, index) => <UserTripCard key={index} trip={trip} />) : [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => <div key={index} className='h-[300px] w-full bg-slate-200 animate-pulse rounded-xl'></div>)}</div>
    </div>
  );
}

export default MyTrips;
