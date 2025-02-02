import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./services/FirebaseConfig.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 5002;

app.post("/checking", (req, res) => {
  const { user, invitedMembers, formData } = req.body;

  if (!user || !invitedMembers || !formData) {
    return res.status(400).send("Invalid body parameters");
  }

  console.log(user, invitedMembers, formData);
  res.send("POST request received");
});

app.get("/api/trip/:userId", async (req, res) => {
  const docRef = doc(db, "AITrip", req.params.userId);
  const snapDoc = await getDoc(docRef);
  console.log(snapDoc.data());
  res.json(snapDoc.data());
});

// API to update itinerary (after editing events)
app.post("/api/trip/update", async (req, res) => {
  const { userId, itinerary } = req.body;

  const docRef = doc(db, "AITrip", userId);
  const data = {
    itinerary: itinerary, // Replace with actual itinerary object
  };
  await setDoc(docRef, data, { merge: true }); // Upsert behavior
  res.json({ message: "Itinerary updated" });
});

app.post("/send-mail", async (req, res) => {
  const { user, invitedMembers, formData, tripId } = req.body;

  if (!invitedMembers || !Array.isArray(invitedMembers)) {
    return res.status(400).send("Invalid invitedMembers parameter");
  }

  invitedMembers.forEach((member) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sikarwalayush147@gmail.com",
        pass: "gwblxpcbpkwgbxse",
      },
    });

    const mailOptions = {
      from: "sikarwalayush147@gmail.com",
      to: member,
      subject: `Invitation to join the trip using TBO`,
      html: `Hello i'm inviting you to join the trip to ${formData.location.label} for ${formData.noOfDays} days. Below is the link to join the trip: <a href="http://localhost:5173/chat-room/${tripId}" target="_blank">Link</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });

  res.send("Emails sent");
});

app.get("/api/country-list/:countryName", async (req, res) => {
  try {
    console.log("Fetching country list...");

    const response = await axios.get(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CountryList",
      {
        auth: {
          username: "hackathontest",
          password: "Hac@98910186",
        },
      }
    );

    // console.log("API Response:", response.data); // Log the API response

    const countryList = response.data.CountryList;
    if (!countryList) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    const { countryName } = req.params;
    const country = countryList.find(
      (country) =>
        country.Name.trim().toLowerCase() === countryName.trim().toLowerCase()
    );

    if (country) {
      res.json({ code: country.Code });
    } else {
      res.json({ code: "no country found" });
    }
  } catch (error) {
    console.error(
      "API Fetch Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//city-code
app.post("/api/city-list", async (req, res) => {
  try {
    console.log("Fetching city list...");
    const { code, cityName } = req.body;

    console.log(code, cityName);
    const response = await axios.post(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList",
      {
        CountryCode: code,
      },
      {
        auth: {
          username: "hackathontest",
          password: "Hac@98910186",
        },
      }
    );

    console.log("API Response:", response.data);
    const { Status, CityList } = response.data;

    if (Status.Code !== 200) {
      return res.status(500).json({ error: "API request failed" });
    }

    if (!CityList) {
      return res.status(500).json({ error: "City list is empty or missing" });
    }

    const city = CityList.find(
      (city) =>
        city.Name.trim().toLowerCase().split(",")[0] ===
        cityName.trim().toLowerCase()
    );

    if (city) {
      res.json({ city: city.Code });
    } else {
      res.json({ code: "no city found" });
    }
  } catch (error) {
    console.error(
      "API Fetch Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//hotel-array
app.post("/api/hotels", async (req, res) => {
  try {
    console.log("Fetching hotel list...");
    const { code } = req.body;

    console.log("code",code);
    if (!code){
        return res.status(404).json({error:"City code is required"})
    }
    const response = await axios.post(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
      {
        CityCode: code,
        IsDetailedResponse: "true",
      },
      {
        auth: {
          username: "hackathontest",
          password: "Hac@98910186",
        },
      }
    );

    const { Status, Hotels } = response.data;

    if (Status.Code !== 200) {
      return res.status(500).json({ error: "API request failed" });
    }

    if (!Hotels) {
      return res.status(500).json({ error: "City list is empty or missing" });
    }

    //   const city = CityList.find(
    //     (city) => city.Name.trim().toLowerCase() === cityName.trim().toLowerCase()
    //   );

    if (Hotels) {
      res.json({ Hotel: Hotels.slice(0,20) });
    } else {
      res.json({ code: "no city found" });
    }
  } catch (error) {
    console.error(
      "API Fetch Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//photos-api
app.post("/api/hotel-detail", async (req, res) => {
  try {
    console.log("Fetching hotel detail...");
    const { code } = req.body;

    console.log(code);
    const response = await axios.post(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails",
      {
        Hotelcodes: code,
        Language: "en",
      },
      {
        auth: {
          username: "hackathontest",
          password: "Hac@98910186",
        },
      }
    );

    console.log("API Response:", response.data);
    const { Status, HotelDetails } = response.data;

    if (Status.Code !== 200) {
      return res.status(500).json({ error: "API request failed" });
    }

    if (!HotelDetails) {
      return res.status(500).json({ error: "City list is empty or missing" });
    }

    //   const city = CityList.find(
    //     (city) => city.Name.trim().toLowerCase().split(",")[0] === cityName.trim().toLowerCase()
    //   );

    if (HotelDetails) {
      res.json({ HotelDetails });
    } else {
      res.json({ code: "no city found" });
    }
  } catch (error) {
    console.error(
      "API Fetch Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//price-route
app.post("/api/price-detail", async (req, res) => {
  try {
    console.log("Fetching hotel detail...");
    const { code, inDate, outDate } = req.body;

    console.log(code);
    const response = await axios.post(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/search",
      {
        CheckIn: inDate,
        CheckOut: outDate,
        HotelCodes: code,
        GuestNationality: "IN",
        PaxRooms: [
          {
            Adults: 1,
            Children: 0,
            ChildrenAges: [],
          },
        ],
        ResponseTime: 18,
        IsDetailedResponse: true,
        Filters: {
          Refundable: false,
          NoOfRooms: 0,
          MealType: "All",
        },
      },
      {
        auth: {
          username: "hackathontest",
          password: "Hac@98910186",
        },
      }
    );

    console.log("API Response:", response.data);
    const { Status, HotelResult } = response.data;

    if (Status.Code !== 200) {
      return res.json({ code: 201 });
    }

    if (!HotelResult) {
      return res.status(500).json({ error: "City list is empty or missing" });
    }

    //   const city = CityList.find(
    //     (city) => city.Name.trim().toLowerCase().split(",")[0] === cityName.trim().toLowerCase()
    //   );

    if (HotelResult) {
      res.json({ HotelResult });
    } else {
      res.json({ code: "no city found" });
    }
  } catch (error) {
    console.error(
      "API Fetch Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


app.post("/api/flight-search", async (req, res) => {
    try {
        // console.log("Received request body:", req.body);  // Log incoming request
        const searchReq = req.body;
        if (!searchReq) {
            return res.status(400).json({ error: "Missing 'searchReq' in request body" });
        }

        const resp = await axios.post(
            "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
            searchReq,
            { headers: { "Content-Type": "application/json" } }
        );

        res.json(resp.data);
    } catch (error) {
        console.error("Error in flight search:", error.response?.data || error.message);
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
});




const users = new Map(); // Store connected users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining
  socket.on("join", (username) => {
    const userData = {
      id: socket.id,
      username: username,
    };

    users.set(socket.id, userData);
    io.emit("user-joined", userData);

    // Send list of existing users
    socket.emit("existing-users", Array.from(users.values()));
  });

  // Handle sending messages
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    socket.broadcast.emit("user-typing", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userData = users.get(socket.id);
    if (userData) {
      users.delete(socket.id);
      io.emit("user-left", userData);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
