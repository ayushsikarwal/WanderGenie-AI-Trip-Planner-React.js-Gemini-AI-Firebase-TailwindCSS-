import Header from "@/components/ui/custom/Header";
import { db } from "@/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const NewBudgetingTool = () => {
  const baseURL = "http://localhost:5000";

  // Define states first, with proper initial values
  const [data, setData] = useState({
    contributionChart: "",
    dueChart: "",
    categoryChart: "",
    chatHistory: [],
    totalExpenditure: 0,
  });

  const [status, setStatus] = useState("Press the button and speak");
  const [searchStatus, setSearchStatus] = useState(
    "Press the button and speak your query"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchRecording, setIsSearchRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [trip, setTrip] = useState(null);

  const { tripId } = useParams();

  // Use a ref to hold the MediaRecorder instance
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;
      try {
        const docRef = doc(db, "AITrip", tripId);
        const snapDoc = await getDoc(docRef);
        if (snapDoc.exists()) {
          setTrip(snapDoc.data());
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };
    fetchTripData();
  }, [tripId]);

  // Separate effect for API call
  useEffect(() => {
    if (!trip) return;

    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripInvitedUser: trip?.invitedUsersName || [],
        tripOrganiser: trip?.user?.given_name || "",
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Match the backend response structure
        setData({
          contributionChart: responseData.contributionChart || "",
          dueChart: responseData.dueChart || "",
          categoryChart: responseData.categoryChart || "",
          chatHistory: responseData.chatHistory || [],
          totalExpenditure: responseData.totalExpenditure || 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
      });
  }, [trip]);

  const handleRecord = async () => {
    if (isRecording) {
      // Stop Recording
      setIsRecording(false);
      setStatus("Processing audio...");
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    // Start Recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store the stream

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; // Store mediaRecorder in ref
      audioChunksRef.current = []; // Clear previous chunks

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        setIsLoading(true);
        setStatus("Uploading audio...");

        try {
          const response = await fetch("http://127.0.0.1:5000/upload_audio", {
            method: "POST",
            body: formData,
          });

          const responseData = await response.json();
          setStatus(responseData.message);
          setData((prevData) => {
            const newData = {
              ...prevData,
              contributionChart: responseData.contributionChart,
              dueChart: responseData.dueChart,
              categoryChart: responseData.categoryChart,
              chatHistory: responseData.chatHistory,
              totalExpenditure: responseData.totalExpenditure,
            };

            // Save the charts to localStorage
            localStorage.setItem("contributionChart", newData.contributionChart);
            localStorage.setItem("dueChart", newData.dueChart);

            return newData;
          });
        } catch (error) {
          setStatus("Error uploading audio.");
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Recording...");
    } catch (error) {
      setStatus("Error accessing microphone.");
      console.error("Error:", error);
    }
  };



const handleSearch = async () => {
  if (isSearchRecording) {
    // Stop Recording
    setIsSearchRecording(false);
    setSearchStatus("Processing query...");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    return;
  }

  // Start Recording
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // Store the stream

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder; // Store mediaRecorder in ref
    audioChunksRef.current = []; // Clear previous chunks

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      setIsSearchLoading(true);
      setSearchStatus("Uploading query...");

      try {
        const response = await fetch("http://127.0.0.1:5000/search", {
          method: "POST",
          body: formData,
        });

        const responseData = await response.json();
        if (responseData.error) {
          setSearchResults([`Error: ${responseData.error}`]);
        } else {
          console.log(responseData.results);
          setSearchResults(responseData.results);
        }
      } catch (error) {
        setSearchStatus("Error uploading query.");
        console.error("Error:", error);
      } finally {
        setIsSearchLoading(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      }
    };

    mediaRecorder.start();
    setIsSearchRecording(true);
    setSearchStatus("Recording...");
  } catch (error) {
    setSearchStatus("Error accessing microphone.");
    console.error("Error:", error);
  }
};


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            Trip Budgeting Dashboard
          </h1>
          <div className="flex gap-5">
            {/* Chat History Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-teal-500 rounded-full mr-3"></span>
                Chat History
              </h2>
              <div className="space-y-3 {**max-h-96} overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {data.chatHistory?.map((message, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Charts Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    Individual Contributions
                  </h2>
                  {data.contributionChart ? (
                    <img
                      src={`data:image/png;base64,${localStorage.getItem("contributionChart")}`}
                      alt="Individual Contribution Chart"
                      className="w-full h-auto rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    Due Amounts
                  </h2>
                  {data.dueChart ? (
                    <img
                      src={`data:image/png;base64,${localStorage.getItem("dueChart")}`}
                      alt="Due Amounts Chart"
                      className="w-full h-auto rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    Expense Categories
                  </h2>
                  {data.categoryChart ? (
                    <img
                      src={`data:image/png;base64,${data.categoryChart}`}
                      alt="Expense Category Chart"
                      className="w-full h-auto rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-yellow-500 rounded-full mr-3"></span>
                    Total Expenditure
                  </h2>
                  <p className="text-5xl font-bold text-gray-900">
                    ₹{data.totalExpenditure.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Voice Controls Section */}
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Voice Input
                  </h2>
                  <button
                    onClick={handleRecord}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-medium text-white shadow-sm transition-all duration-200 ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-300"
                        : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
                    }`}
                  >
                    {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
                  </button>
                  <p className="mt-4 text-gray-600 italic">{status}</p>
                  {isLoading && (
                    <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
                    Voice Search
                  </h2>
                  <button
                    onClick={handleSearch}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-medium text-white shadow-sm transition-all duration-200 ${
                      isSearchRecording
                        ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-300"
                        : "bg-indigo-500 hover:bg-indigo-600 hover:scale-105"
                    }`}
                  >
                    {isSearchRecording ? "⏹ Stop Search" : "🔍 Search by Voice"}
                  </button>
                  <p className="mt-4 text-gray-600 italic">{searchStatus}</p>
                  {isSearchLoading && (
                    <div className="mt-4 w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                Search Results
              </h2>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewBudgetingTool;
