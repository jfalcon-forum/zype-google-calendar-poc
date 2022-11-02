import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
    console.log(id);
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
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {event.summary}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Start: {start.toFormat("MM-dd-yyyy")} - {start.c.hour}:
            {start.c.minute}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            End: {end.toFormat("MM-dd-yyyy")} - {end.c.hour}:{end.c.minute}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setIsEditing(!isEditing)}>
            Update Event
          </Button>
        </CardActions>
        <CardActions>
          <Button size="small" onClick={() => deleteEvent(event.id)}>
            Delete Event
          </Button>
        </CardActions>
      </Card>
      {isEditing ? <EventForm event={event} setIsEditing={setIsEditing} /> : ""}
    </div>
  );
}
