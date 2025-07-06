import axios from "axios";
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": "AIzaSyArtrKSKkUhby9zmxSUP14pgsyOGs2V0R4",
    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
  },
};

export const GetPlaceDetails = async (data) => {
  console.log("inside this place");

  axios.post(BASE_URL, data, config);
};
