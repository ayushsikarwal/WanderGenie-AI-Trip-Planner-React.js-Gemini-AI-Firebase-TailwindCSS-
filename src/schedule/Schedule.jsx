import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useParams } from "react-router-dom";
import FloatingNavBar from "@/components/ui/custom/FloatingNavBar";
import { Calender } from "@/components/Calender";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {tripId} = useParams()

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/trip/${tripId}`)
      .then((res) => {
        const itinerary = res.data?.tripData?.itinerary;

        if (!itinerary || typeof itinerary !== "object") {
          console.error("Itinerary is missing or not an object:", itinerary);
          return;
        }

        const formattedEvents = [];

        Object.values(itinerary).forEach((day) => {
          if (!day.activities || !Array.isArray(day.activities)) {
            console.warn("Missing or invalid activities array in day:", day);
            return;
          }

          day.activities.forEach((activity) => {
            if (!activity.optimalVisitTime ) {
              console.warn("Missing time details in activity:", activity);
              return;
            }

            const start = moment(
              `${day.date} ${activity.optimalVisitTime.split(" to ")[0]}`,
              "DD-MM-YYYY hh:mm A"
            ).toDate();
            const end = moment(
              `${day.date} ${activity.optimalVisitTime.split(" to ")[1]}`,
              "DD-MM-YYYY hh:mm A"
            ).toDate();

            formattedEvents.push({
              id: activity.placeName,
              title: activity.placeName,
              start,
              end,
              details: activity,
              resourceId: activity.placeName,
            });
          });
        });

        setEvents(formattedEvents);
      })
      .catch((err) => console.error("API Fetch Error:", err));
  }, [tripId]);

  

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);

    axios.post("http://localhost:5001/api/trip/update", {
      userId: tripId,
      itinerary: updatedEvents,
    });
  };

  const handleEventResize = ({ event, start, end }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);

    axios.post("http://localhost:5001/api/trip/update", {
      userId: tripId,
      itinerary: updatedEvents,
    });
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:"); // Get input from user
    if (title) {
      const newEvent = { start, end, title };
      setEvents([...events, newEvent]); // Update state with new event
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="calendar-container">
       <div className="calendar-card">
        <h2 className="calendar-title">Your Travel Itinerary</h2>
        <div className="calendar-wrapper">
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onSelectSlot={handleSelectSlot}
            resizable
            selectable
            onSelectEvent={handleEventClick}
            defaultView="week"
            views={["day","week"]}
            step={30}
            formats={{
              timeGutterFormat: "h:mm A",
              eventTimeRangeFormat: ({ start, end }) =>
                `${moment(start).format("h:mm A")} - ${moment(end).format(
                  "h:mm A"
                )}`,
            }}
          />
        </div>
        <FloatingNavBar tripId={tripId}/>
      </div>

      {selectedEvent && (
        <div className="event-details-card">
          <h3 className="event-title">{selectedEvent.title}</h3>
          <p className="event-time">
            Time: {moment(selectedEvent.start).format("h:mm A")} -{" "}
            {moment(selectedEvent.end).format("h:mm A")}
          </p>
          {selectedEvent.details && (
            <p className="event-description">{selectedEvent.details.description}</p>
          )}
        </div>
      )}

      <style>
        {`
          .calendar-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
          }

          .calendar-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            height:100%;
          }

          .calendar-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            color: #2d3748;
          }

          .calendar-wrapper {
            height: 100vh;
            
          }

          .event-details-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }

          .event-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #2d3748;
          }

          .event-time {
            color: #4a5568;
            margin-bottom: 10px;
          }

          .event-description {
            color: #4a5568;
            line-height: 1.5;
          }

          .rbc-calendar {
            background-color: #fff;
            border-radius: 8px;
          }

          .rbc-event {
            background-color: #b098ff;
            border: none;
            border-radius: 4px;
            padding: 2px 5px;
            color: white;
            cursor: move;
            transition: opacity 0.2s;
          }

          .rbc-event:hover {
            opacity: 0.8;
          }

          .rbc-today {
            background-color: #f7fafc;
          }

          .rbc-header {
            padding: 10px;
            font-weight: bold;
            background-color: #f8fafc;
          }

          .rbc-time-content {
            border: 1px solid #e2e8f0;
          }

          .rbc-timeslot-group {
            border-bottom: 1px solid #e2e8f0;
          }

          .rbc-time-view {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }

          .rbc-time-header {
            background-color: #f8fafc;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }

          .rbc-time-header-content {
            border-left: 1px solid #e2e8f0;
          }

          .rbc-time-gutter {
            background-color: #f8fafc;
          }

          .rbc-event-label {
            font-size: 12px;
          }

          .rbc-event-content {
            font-size: 14px;
          }

          .rbc-toolbar {
            margin-bottom: 20px;
          }

          .rbc-toolbar button {
            color: #4a5568;
            background-color: #fff;
            border: 1px solid #e2e8f0;
            padding: 8px 16px;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .rbc-toolbar button:hover {
            background-color: #f7fafc;
          }

          .rbc-toolbar button.rbc-active {
            background-color: #3182ce;
            color: white;
            border-color: #3182ce;
          }
        `}
      </style> 
    
    </div>
  );
};

export default Schedule;