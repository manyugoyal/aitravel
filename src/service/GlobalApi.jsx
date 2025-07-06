import axios from "axios";
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": "AIzaSyDEYoYidQ4EEVYxliPT9O_VEUW-6yxjeSE",
    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
  },
};

export const GetPlaceDetails = async (data) => {
  console.log("inside this place");

  axios.post(BASE_URL, data, config);
};
