import axios from 'axios';
import React, { useState } from 'react';

const BookingPortal = () => {
    const [adultCount, setAdultCount] = useState('');
    const [childCount, setChildCount] = useState('');
    const [infantCount, setInfantCount] = useState('');
    const [directFlight, setDirectFlight] = useState(false);
    const [oneStopFlight, setOneStopFlight] = useState(false);
    const [journeyType, setJourneyType] = useState('1'); // Default to round trip
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [flightCabinClass, setFlightCabinClass] = useState('1'); // Economy
    const [preferredDepartureTime, setPreferredDepartureTime] = useState('');
    const [preferredArrivalTime, setPreferredArrivalTime] = useState('');
    const [searchResponse, setSearchResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add a loading state

    const handleSearch = async () => {
        // Basic validation
        if (!origin || !destination || !preferredDepartureTime || !preferredArrivalTime) {
            setError("Please fill in all required fields.");
            return;
        }

        setError(null); // Clear any previous errors
        setLoading(true); // Start loading

        const searchRequest = {
            EndUserIp: "192.168.10.10", // Static from your requirements
            TokenId: "ac2751e9-4cc3-406f-b678-c947e4f57a00", // Static from your requirements
            AdultCount: adultCount,
            ChildCount: childCount,
            InfantCount: infantCount,
            DirectFlight: directFlight,
            OneStopFlight: oneStopFlight,
            JourneyType: journeyType,
            PreferredAirlines: null, // You can add logic for this if needed
            Segments: [
                {
                    Origin: origin,
                    Destination: destination,
                    FlightCabinClass: flightCabinClass,
                    PreferredDepartureTime: preferredDepartureTime,
                    PreferredArrivalTime: preferredArrivalTime,
                },
            ],
            Sources: null, // You can add logic for this if needed
        };

        try {
            // Replace with your actual API endpoint
            // console.log("Sending search request:", JSON.stringify(searchReq, null, 2));
            const response = await axios.post('http://localhost:5001/api/flight-search', {
                EndUserIp: "10.145.17.30",
                TokenId: "cf1e16fc-b9e7-41bd-b7f4-6a7e703ad6c6",
                AdultCount: "1",
                ChildCount: "1",
                InfantCount: "1",
                DirectFlight: "false",
                OneStopFlight: "false",
                JourneyType: "1",
                PreferredAirlines: null,
                Segments: [{
                    Origin: "JAI",
                    Destination: "CCU",
                    FlightCabinClass: "1",
                    PreferredDepartureTime: "2025-2-10T00:00:00",
                    PreferredArrivalTime: "2025-2-10T00:00:00"
                }],
                Sources: null
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            

            // const response = await fetch('http://localhost:5001/api/flight-search', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(searchRequest),
            // });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const data = await response.json();
            const data = await response.data;
            setSearchResponse(data);
            console.log("Search Response:", data); // Log the entire response to the console
        } catch (e) {
            setError(`Search failed: ${e.message}`);
            setSearchResponse(null);
            console.error("Search Error:", e); // Log the error to the console
        } finally {
            setLoading(false); // Stop loading, regardless of success or failure
        }
    };

    const displayFlights = () => {
        if (!searchResponse || !searchResponse.Response || searchResponse.Response.ResponseStatus !== 1 || !searchResponse.Response.Results) {
            return <div className="text-gray-500">No flights found for your criteria.</div>;
        }

        return searchResponse.Response.Results.map((resultGroup, index) => (
            <div key={index} className="mb-4">
                {resultGroup.map((flight, flightIndex) => (
                    <div key={flightIndex} className="bg-white p-10 shadow rounded-xl mb-2">
                        <div className="flex  justify-between items-center">
                            <div className='flex flex-col items-center'>
                                <h3 className="text-lg font-semibold text-gray-800">{flight.AirlineCode} - {flight.Segments[0][0].Airline.FlightNumber}</h3>
                                <p className="text-sm text-gray-600">{flight.Segments[0][0].Origin.Airport.CityName} ({flight.Segments[0][0].Origin.Airport.AirportCode}) to {flight.Segments[0][0].Destination.Airport.CityName} ({flight.Segments[0][0].Destination.Airport.AirportCode})</p>
                                <img className='w-[60px] pt-6' src='/airplane.png' />
                            </div>

                            <div className="mt-2 space-y-1 pt-2">
                            <p className="text-sm font-extrabold text-gray-700">Departure: {new Date(flight.Segments[0][0].Origin.DepTime).toLocaleString()}</p>
                            <p className="text-sm font-extrabold text-gray-700">Arrival: {new Date(flight.Segments[0][0].Destination.ArrTime).toLocaleString()}</p>
                            <p className="text-sm text-gray-700">⏲️ Duration: {flight.Segments[0][0].Duration} minutes</p>
                            <p className="text-sm text-gray-700">🧳 Cabin Baggage: {flight.Segments[0][0].CabinBaggage}, Baggage: {flight.Segments[0][0].Baggage}</p>
                            </div>

                            <div className="text-right">
                                <span className="text-xl font-bold text-indigo-700">₹{flight.Fare.OfferedFare}</span>
                                <p className="text-gray-500 text-sm">Total Fare</p>
                                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-2">Book Now</button>
                            </div>
                            
                        </div>
                        
                    </div>
                ))}
            </div>
        ));
    };


    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Airline Booking Portal</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="origin" className="block text-gray-700 text-sm font-bold mb-2">Origin:</label>
                            <input
                                type="text"
                                id="origin"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
                            <input
                                type="text"
                                id="destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="adultCount" className="block text-gray-700 text-sm font-bold mb-2">Adult Count:</label>
                            <input
                                type="number"
                                id="adultCount"
                                value={adultCount}
                                onChange={(e) => setAdultCount(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="childCount" className="block text-gray-700 text-sm font-bold mb-2">Child Count:</label>
                            <input
                                type="number"
                                id="childCount"
                                value={childCount}
                                onChange={(e) => setChildCount(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="infantCount" className="block text-gray-700 text-sm font-bold mb-2">Infant Count:</label>
                            <input
                                type="number"
                                id="infantCount"
                                value={infantCount}
                                onChange={(e) => setInfantCount(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="journeyType" className="block text-gray-700 text-sm font-bold mb-2">Journey Type:</label>
                            <select
                                id="journeyType"
                                value={journeyType}
                                onChange={(e) => setJourneyType(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="1">Round Trip</option>
                                <option value="2">One Way</option>
                                <option value="3">Multi City</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="flightCabinClass" className="block text-gray-700 text-sm font-bold mb-2">Cabin Class:</label>
                            <select
                                id="flightCabinClass"
                                value={flightCabinClass}
                                onChange={(e) => setFlightCabinClass(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="1">Economy</option>
                                <option value="2">Premium Economy</option>
                                <option value="3">Business</option>
                                <option value="4">First Class</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="preferredDepartureTime" className="block text-gray-700 text-sm font-bold mb-2">Departure Time:</label>
                            <input
                                type="datetime-local"
                                id="preferredDepartureTime"
                                value={preferredDepartureTime}
                                onChange={(e) => setPreferredDepartureTime(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="preferredArrivalTime" className="block text-gray-700 text-sm font-bold mb-2">Arrival Time:</label>
                            <input
                                type="datetime-local"
                                id="preferredArrivalTime"
                                value={preferredArrivalTime}
                                onChange={(e) => setPreferredArrivalTime(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-4">
                            <div className="flex items-center">
                                <input type="checkbox" id="directFlight" checked={directFlight} onChange={(e) => setDirectFlight(e.target.checked)} className="mr-2 leading-tight" />
                                <label htmlFor="directFlight" className="text-sm text-gray-700 font-bold">Direct Flight</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="oneStopFlight" checked={oneStopFlight} onChange={(e) => setOneStopFlight(e.target.checked)} className="mr-2 leading-tight" />
                                <label htmlFor="oneStopFlight" className="text-sm text-gray-700 font-bold">One-Stop Flight</label>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleSearch}
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? <><span className="animate-spin mr-2">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m10.641 5.417A8.001 8.001 0 0115.418 15m0 0H15m-3.909-7.985L12 4m-3.909 7.985L12 20m2.517-0.918a8.003 8.003 0 01-2.517 0"></path>
                                    </svg>
                                </span>Searching...</> : 'Search Flights'}
                            </button>
                        </div>
                    </form>
                </div>

                {loading && <div className="text-center text-gray-500">Searching for available flights...</div>}

                {searchResponse && (
                    <div className="mt-6 space-y-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Flights:</h2>
                        {displayFlights()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPortal;