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

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [border, setBorder] = useState({ badges: "", plan: "" });
  const [openDialogue, setOpenDialogue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfMembers, setNumberOfMembers] = useState(null);
  const [emails, setEmails] = useState([]);
  const [signedUp, setSignedUp] = useState(
    localStorage.getItem("user") ? true : false
  );

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
        onSubmitFunc()
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
    // }
    if(user){
      const AI_PROMPT = `Generate travel plan for : ${formData.location.label}, for ${formData.noOfDays} for ${formData.typeOftrip} with rupees ${formData.budget} budget per person, give me a hotel option list with HotelName, Hotel address, Price, Hotel url, geo coordinates, rating, description and suggest itinerary with placeName, Place details, Place image url, geo coordinates , ticket pricing, rating, time travel each of the location for ${formData.noOfDays} with each day plan with best time to visit in JSON format. Please provide me the URLs of images that are working.`;

      try {
        setLoading(true);
        const result = await chatSession.sendMessage(AI_PROMPT);
        await saveTripDetail(result.response.candidates[0].content.parts[0].text);
        axios.post('http://localhost:5001/send-mail' , {user : user.name, invitedMembers: emails, formData: formData})
        setSignedUp(true);
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate trip plan. Try again.");
      } finally {
        setLoading(false);
      }
    }else{
      setOpenDialogue(true);
    }

    
  };

  const saveTripDetail = async (tripDetail) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrip", docId), {
      tripChoices: formData,
      tripData: JSON.parse(tripDetail),
      user: JSON.parse(localStorage.getItem("user")),
    });
    navigate(`/view-trip/${docId}`);
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
        handleInputChange("typeOfBudget", item.type);
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
    const updatedEmails = Array.from({ length: num }, (_, i) => emails[i] || "");
    setEmails(updatedEmails);
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
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

          <div className="space-y-2">
            <h2 className="text-lg font-medium">
              How many days are you planning your trip for?
            </h2>
            <input
              className="w-full border rounded-lg p-3 text-base"
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
                <h3 className="text-lg font-bold mt-4">Enter Emails for Members</h3>
                {Array.from({ length: numberOfMembers }).map((_, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <label className="mr-2">Member {index + 1}:</label>
                    <input
                      className="border rounded-lg p-2 flex-1"
                      type="email"
                      placeholder={`Enter email for Member ${index + 1}`}
                      value={emails[index] || ""}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
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
            disabled={loading || (formData.typeOftrip=='Family' && numberOfMembers<=2)}
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
