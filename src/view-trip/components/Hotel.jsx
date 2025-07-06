import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";

function Hotel({ trip }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <h2 className="font-bold text-xl mt-5 ">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 ">{!loading ? trip?.tripData?.hotelOptions?.map((item, index) => <HotelCard item={item} index={index} />) : [1, 2, 3].map((item, index) => <div key={index} className="h-[300px] w-full bg-slate-200 animate-pulse rounded-xl"></div>)}</div>
    </div>
  );
}

export default Hotel;
