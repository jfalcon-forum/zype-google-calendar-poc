import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "react-query";
import EventForm from "../components/eventForm";
import axios from "axios";

export default function Event({ event }) {
  // Need a function to format dates for display - Minutes equal 0 don't fill a clock and look off

  const [isEditing, setIsEditing] = useState(false);

  const start = DateTime.fromISO(event.start.dateTime);
  const end = DateTime.fromISO(event.end.dateTime);

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation((id) => {
    return axios.delete(`/api/calendar/${event.id}`);
  });

  const deleteEvent = (id) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };

  return (
    <div>
      <div>
        <h2>{event.summary}</h2>
        <p>
          Start: {start.toFormat("MM-dd-yyyy")} - {start.c.hour}:
          {start.c.minute}
        </p>
        <p>
          End: {end.toFormat("MM-dd-yyyy")} - {end.c.hour}:{end.c.minute}
        </p>
      </div>
      <div>
        <Button size="small" onClick={() => setIsEditing(!isEditing)}>
          Update Event
        </Button>
        <Button size="small" onClick={() => deleteEvent(event.id)}>
          Delete Event
        </Button>
      </div>
      {isEditing ? <EventForm event={event} setIsEditing={setIsEditing} /> : ""}
    </div>
  );
}
