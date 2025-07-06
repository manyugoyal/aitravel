import axios from "axios";

const API_KEY = "AIzaSyArtrKSKkUhby9zmxSUP14pgsyOGs2V0R4"; 
const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;

const requestData = {
  textQuery: "Hotels in Hyderabad"
};

axios.post(url, requestData, {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
  }
})
.then(response => {
  console.log("Response:", response.data);
})
.catch(error => {
  console.error("Error:", error.response ? error.response.data : error.message);
});