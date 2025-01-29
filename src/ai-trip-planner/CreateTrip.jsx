import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import SelectTravelsList from "../constants/SelectTravelsList.jsx";
import CostBadges from "../addtionalComponents/CostBadges.jsx";
import { BadgesData } from "../constants/BadgesData.jsx";
import { Button } from "../components/ui/button.jsx";
import AdditionalComponentsForPlanType from "../addtionalComponents/AdditionalComponentForPlanType.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { chatSession } from "@/services/AIModel.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig.jsx";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/custom/Header.jsx";
import { use } from "react";
import dayjs from "dayjs";
import DatePickerValue from "@/components/DatePickerValue.jsx";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [border, setBorder] = useState({ badges: "", plan: "" });
  const [openDialogue, setOpenDialogue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfMembers, setNumberOfMembers] = useState(null);
  const [emails, setEmails] = useState([]);
  const [names, setNames] = useState([]);
  const [inDate, setInDate] = useState(dayjs(Date.now()));
  const [outDate, setOutDate] = useState(dayjs(Date.now()));
  const [signedUp, setSignedUp] = useState(
    localStorage.getItem("user") ? true : false
  );

  const millisecondsInOneDay = 24 * 60 * 60 * 1000;
  useEffect(() => {
    console.log(
      dayjs(inDate).format("DD-MM-YYYY") +
        "----" +
        dayjs(outDate) +
        "------" +
        Math.floor(outDate.diff(inDate) / millisecondsInOneDay)
    );
    handleInputChange(
      "noOfDays",
      Math.floor(outDate.diff(inDate) / millisecondsInOneDay)
    );
    handleInputChange("inDate", dayjs(inDate).format("DD-MM-YYYY"));
    handleInputChange("outDate", dayjs(outDate).format("DD-MM-YYYY"));
  }, [inDate, outDate]);

  const navigate = useNavigate();
  const toast = useToast();

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserInfo(tokenResponse),
    onError: (error) => console.log(error),
    flow: "implicit", // Make sure this is correct for your setup
  });

  const getUserInfo = (tokenResponse) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialogue(false);
        toast.success("Signed up successfully!");
        setSignedUp(true); // Update the signed-up state
        onSubmitFunc();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Sign-up failed. Please try again.");
      });
  };

  const onSubmitFunc = async () => {
    if (
      !formData.location ||
      !formData.budget ||
      !formData.noOfDays ||
      !formData.typeOftrip
    ) {
      alert("Please fill all the fields before generating a trip.");
      return;
    }

    const user = localStorage.getItem("user");

    // if (!user) {
    //   setOpenDialogue(true);
    // }in
    // •⁠  ⁠Type of Budget: ${formData.typeOfBudget}
    if (user) {
      // const AI_PROMPT = `Generate travel plan for : ${formData.location.label}, for ${formData.noOfDays} for ${formData.typeOftrip} with rupees ${formData.budget} budget per person, give me a hotel option list with HotelName, Hotel address, Price, Hotel url, geo coordinates, rating, description and suggest itinerary with placeName, Place details, Place image url, geo coordinates , ticket pricing, rating, time travel each of the location for ${formData.noOfDays} with each day plan with best time to visit in JSON format. Please provide me the URLs of images that are working.`;
      const AI_PROMPT = `You are a travel assistant. Generate a detailed travel plan based on the following user inputs:
•⁠  ⁠Destination: ${formData.location.label}
•⁠  ⁠Start Date: ${formData.inDate}.
•⁠  End Date: ${formData.outDate}.
•⁠  ⁠Number of Days: ${formData.noOfDays}.
•⁠  ⁠Approximate Budget: ${formData.budget}, this is the budget of my whole trip, so give data accordingly
•⁠  ⁠Additional Details: ${formData.description}
•⁠  ⁠Additional type of trip: ${formData.typeOftrip}
•  Provide names of nearby popular shops, stalls for street food and shopping for each place that you will suggest the user.
•  Also provide name of nearby public transportation accessibility points to the places that you will suggest the user.
Output Details:
Generate the plan in JSON format, ensuring the following details are included:

1.⁠ ⁠Trip Summary:

⁠ tripTitle ⁠: A title summarizing the trip.

⁠ duration ⁠: The exact duration of the trip (e.g., "4 Days").

⁠ travelers ⁠: Number of travelers.

⁠ budget ⁠: Total budget in INR.

⁠ currency ⁠: "INR".

2.⁠ ⁠Hotel Options:
Provide a list (atleast 5) of hotels, which are under my budget with the following details for each:

⁠ hotelName ⁠: Name of the hotel.

⁠ hotelAddress ⁠: Full address.

⁠ price ⁠: Approximate price per night in INR.

⁠ hotelUrl ⁠: A functional URL for booking or hotel details.

⁠ geoCoordinates ⁠: Latitude and longitude of the hotel.

⁠ rating ⁠: User rating out of 5.

⁠ description ⁠: A brief description of the hotel, highlighting features or recommendations.

3.⁠ ⁠Itinerary:
Generate a day-wise plan starting from the given start date for the specified number of days. Include:

⁠ date ⁠: The date for each day (in DD-MM-YYYY format).

⁠ theme ⁠: The main theme or focus of the day (e.g., cultural exploration, shopping, relaxation).

⁠ bestTimeToVisit ⁠: The ideal time to visit the planned attractions.

⁠ activities ⁠: A list of places with the following details:

⁠ placeName ⁠: Name of the place.

⁠ placeDetails ⁠: A short description of the attraction.

⁠ placeImageUrl ⁠: URL to an image of the place (ensure it’s working).

⁠ geoCoordinates ⁠: Latitude and longitude.

⁠ ticketPricing ⁠: Approximate ticket pricing in INR.

⁠ rating ⁠: User rating out of 5.

⁠ timeTravel ⁠: Approximate travel time to reach the destination from the hotel or city center.

4.⁠ ⁠Estimated Cost Breakdown:
Provide an approximate breakdown of the total cost in the following categories:

Accommodation (min and max) in INR.

Sightseeing (min and max) in INR.

Food (min and max) in INR.

Transport (min and max) in INR.

5.⁠ ⁠Additional Notes:

Ensure all dates match the given start date and follow sequentially.

Provide URLs of images that are functional.

Format all output data in JSON format.`;

      try {
        setLoading(true);
        const result = await chatSession.sendMessage(AI_PROMPT);
        console.log(result.response.candidates[0].content.parts[0].text);
        await saveTripDetail(
          result.response.candidates[0].content.parts[0].text,
          user
        );
        // axios.post('http://localhost:5001/send-mail' , {user : user.name, invitedMembers: emails, formData: formData})
        setSignedUp(true);
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate trip plan. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setOpenDialogue(true);
    }
  };

  const saveTripDetail = async (tripDetail, user) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrip", docId), {
      tripChoices: formData,
      tripData: JSON.parse(tripDetail),
      user: JSON.parse(localStorage.getItem("user")),
      invitedUsersName: names,
      invitedUsersEmail: emails,
    });
    navigate(`/view-trip/${docId}`);
    axios.post("http://localhost:5001/send-mail", {
      user: user.name,
      invitedMembers: emails,
      formData: formData,
      tripId: docId,
    });
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const badges = BadgesData.map((item, index) => (
    <div
      key={index}
      className={`p-4 rounded hover:shadow-lg mx-4 border-2 ${
        border.badges === item.type ? "border-black" : ""
      }`}
      onClick={() => {
        // handleInputChange("typeOfBudget", item.type);
        setBorder((border) => ({ ...border, badges: item.type }));
      }}
    >
      <CostBadges
        handleInputChange={handleInputChange}
        logo={item.logo}
        type={item.type}
        desc={item.desc}
      />
    </div>
  ));

  const plan = SelectTravelsList.map((item, index) => (
    <div
      key={index}
      className={`p-4 rounded hover:shadow-lg mx-4 border-2 ${
        border.plan === item.title ? "border-black" : ""
      }`}
      onClick={() => {
        handleInputChange("typeOftrip", item.title);
        setBorder((border) => ({ ...border, plan: item.title }));
      }}
    >
      <AdditionalComponentsForPlanType
        handleInputChange={handleInputChange}
        logo={item.icon}
        type={item.title}
        desc={item.desc}
      />
    </div>
  ));

  const handleMemberChange = (e) => {
    const num = parseInt(e.target.value, 10) || 0;
    setNumberOfMembers(num);

    // Adjust the email array to match the number of members
    const updatedEmails = Array.from(
      { length: num },
      (_, i) => emails[i] || ""
    );
    setEmails(updatedEmails);
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <>
      <Header />
      <div className="px-4 sm:px-6 lg:px-9 py-6 max-w-7xl mx-auto space-y-6">
        <h3 className="font-extrabold text-2xl sm:text-3xl md:text-[36px] leading-tight">
          Tell us your travel preferences
        </h3>
        <p className="text-[#808080] text-sm sm:text-base">
          Just provide some basic information, and our trip planner will
          generate a customized itinerary based on your preferences.
        </p>

        <div className="border rounded-lg shadow-md p-4 sm:p-5 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Name of your trip</h2>
            <input
              className="w-full border rounded-lg p-3 text-base"
              type="text"
              placeholder=" Ex: Goa is onnnnn !!!!!!"
              onChange={(e) => handleInputChange("tripName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">
              What is the choice of Destination?
            </h2>
            <div className="w-full">
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                selectProps={{
                  place,
                  onChange: (e) => {
                    setPlace(e.label);
                    handleInputChange("location", e);
                  },
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      minHeight: "44px",
                    }),
                  },
                }}
              />
            </div>
          </div>

          <div>
            <DatePickerValue
              inDate={inDate}
              outDate={outDate}
              setInDate={setInDate}
              setOutDate={setOutDate}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">
              How many days are you planning your trip for?
            </h2>
            <input
              disabled
              className="w-full border rounded-lg p-3 text-base"
              value={Math.floor(outDate.diff(inDate) / millisecondsInOneDay)}
              type="number"
              placeholder="Ex: 9"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Type of your budget?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges}
            </div>
            <div disabled={true}>
              <h2 className="text-lg font-medium">
                Approximate budget per person in Rupees*
              </h2>
              <input
                className="w-full border rounded-lg p-3 text-base"
                type="number"
                placeholder="Ex: 6000"
                onChange={(e) => handleInputChange("budget", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">
              Who do you plan on traveling with?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Describle your interest</h2>
            <input
              className="w-full border rounded-lg p-3 text-base"
              type="text"
              placeholder=" Ex: I want a trip with full of adventure with my homies"
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          {formData.typeOftrip == "Family" ? (
            <div>
              <h2 className="text-lg font-extrabold">Invite Members</h2>
              <div className="flex px-3">
                <h2 className="text-lg font-medium">Number of members</h2>
                <input
                  className="w-full border rounded-lg p-3 text-base"
                  type="number"
                  value={numberOfMembers}
                  onChange={handleMemberChange}
                  min="0"
                />
              </div>

              {numberOfMembers > 0 && (
                <div>
                  <h3 className="text-lg font-bold mt-4">
                    Enter Emails for Members
                  </h3>
                  {Array.from({ length: numberOfMembers }).map((_, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <label className="mr-2">Member {index + 1}:</label>
                      <div className="mx-3 mt-2">
                        <input
                          className="border rounded-lg p-2 flex-1 mx-2 w-[500px]"
                          type="userName"
                          placeholder={`Enter name for Member ${index + 1}`}
                          value={names[index] || ""}
                          onChange={(e) =>
                            handleNameChange(index, e.target.value)
                          }
                        />
                        <input
                          className="border rounded-lg p-2 flex-1 mx-2 w-[500px]"
                          type="email"
                          placeholder={`Enter email for Member ${index + 1}`}
                          value={emails[index] || ""}
                          onChange={(e) =>
                            handleEmailChange(index, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            disabled={
              loading ||
              (formData.typeOftrip == "Family" && numberOfMembers <= 2)
            }
            onClick={onSubmitFunc}
            className="w-full sm:w-auto px-6 py-2"
          >
            {loading ? (
              <VscLoading className="animate-spin" />
            ) : (
              "Generate Trip"
            )}
          </Button>
        </div>

        <Dialog open={openDialogue}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Sign up to proceed
              </DialogTitle>
              <DialogDescription className="space-y-4">
                <h2 className="text-base">Please sign up to continue</h2>
                <Button
                  onClick={() => signIn()}
                  disabled={signedUp}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default CreateTrip;
