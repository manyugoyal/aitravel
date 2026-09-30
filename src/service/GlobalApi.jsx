import axios from "axios";

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": PLACES_API_KEY,
    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
  },
};

export const GetPlaceDetails = async (data) => {
  return axios.post(SEARCH_URL, data, config);
};

// Destination-search autocomplete for the "where are you heading?" step.
// Google Places doesn't rate-limit a billed key the way Nominatim's shared
// public API does, so this replaces the OpenStreetMap Nominatim lookup that
// kept tripping a 429 during demos.
export const GetPlaceSuggestions = async (input) => {
  const res = await axios.post(
    AUTOCOMPLETE_URL,
    { input },
    { headers: { "Content-Type": "application/json", "X-Goog-Api-Key": PLACES_API_KEY } }
  );

  const suggestions = res.data?.suggestions || [];
  return suggestions
    .filter((s) => s.placePrediction)
    .map((s) => ({
      placeId: s.placePrediction.placeId,
      description: s.placePrediction.text?.text || "",
    }));
};
