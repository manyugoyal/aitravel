import { db } from "../../service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "../components/InfoSection";
import { useState } from "react";
import Hotel from "../components/Hotel";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";
function ViewTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState({});
  useEffect(() => {
    GetTripData();
    // window.location.reload();
  }, [id]);

  const GetTripData = async () => {
    console.log("Inside this function", id);

    const docRef = doc(db, "AITrips", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
      toast("No such document!");
    }
  };

  return (
    <>
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        {/* Information section */}
        <InfoSection trip={trip} />

        {/* { reccomended hotels} */}
        <Hotel trip={trip} />
        {/* daily plan */}
        <PlacesToVisit trip={trip} />
        {/* footer */}
        <Footer/>
      </div>
    </>
  );
}

export default ViewTrip;
