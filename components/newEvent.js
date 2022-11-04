import { useState } from "react";
import { DateTime } from "luxon";
import axios from "axios";
import Button from "@mui/material/Button";
import { Form, Field, useForm } from "react-final-form";
import {
  useMutation,
  QueryCache,
  QueryClient,
  useQueryClient,
} from "react-query";

export default function NewEvent() {
  // Form will be LARGE; Need to think about how to optimize it
  // Most react form tutorials expect state management to be handled by hooks or redux
  // SPA we can use hooks

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation((event) => {
    return axios.post("/api/calendar", event);
  });

  const addEvent = (e) => {
    // default date/time is used here; we need to add a date picker and convert the date time
    const start = "2022-11-01T10:00:00Z";
    const end = "2022-11-01T12:00:00Z";
    let event = {
      summary: e.summary,
      end: {
        dateTime: end,
        timeZone: "America/Chicago",
      },
      start: {
        dateTime: start,
        timeZone: "America/Chicago",
      },
    };
    // can add more settings here for refreshing data also should add validation step before making calls.
    // The initial call will be too google but then we need to make a call to zype
    mutate(event, {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
    // sanitize event
  };

  // Need function to validate and reform form data

  if (isLoading) {
    return "Saving your changes";
  }

  return (
    <Form
      onSubmit={addEvent}
      render={({ handleSubmit }) => (
        <form style={{ marginTop: "24px" }} onSubmit={handleSubmit}>
          <h2>New Event</h2>
          <div>
            <label style={{ marginRight: "8px" }}>Event Name</label>
            <Field name="summary" component="input" placeholder="Event Name" />
          </div>
          <Button size="small" style={{ marginTop: "8px" }} type="submit">
            Submit
          </Button>
        </form>
      )}
    />
  );
}
