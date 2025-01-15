import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

const config = {
    headers:{
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':['places.photos','places.displayName','places.id']
        
    }
}

export const GetPlaceDetails =async (data)=>await axios.post(BASE_URL, data, config)
export const Photo_Req = (name, height, width)=>{
    return `https://places.googleapis.com/v1/${name}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxWidthPx=${width}&maxHeightPx=${height}`;
}