import { db } from "../service/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserTripCard from "./components/UserTripCard";

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email),
        orderBy("createdAt", "desc"),
        limit(9) // Sorting by newest trips first
      );
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => trips.push(doc.data()));
      setUserTrips(trips);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      toast("Couldn't load your trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='p-10 md:px-20 text-center text-3xl font-bold'>Latest Trips </h2>

      {!loading && userTrips.length === 0 ? (
        <p className='text-center text-gray-500 pb-10'>You haven't created any trips yet.</p>
      ) : (
        <div className='mx-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => <div key={index} className='h-[300px] w-full bg-slate-200 animate-pulse rounded-xl'></div>)
            : userTrips.map((trip, index) => <UserTripCard key={index} trip={trip} />)}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
