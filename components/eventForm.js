import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import axios from "axios";
import { Form, Field, useForm } from "react-final-form";
import {
  useMutation,
  QueryCache,
  QueryClient,
  useQueryClient,
} from "react-query";

export default function EventForm({ event }) {
  // Form will be LARGE; Need to think about how to optimize it
  // Most react form tutorials expect state management to be handled by hooks or redux
  // SPA we can use hooks

  const [fields, setFields] = useState({ ...event });

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation((event) => {
    console.log(event);
    return axios.put(`/api/calendar/${event.id}`, event);
  });

  const updateEvent = (e) => {
    // default date/time is used here; we need to add a date picker and convert the date time
    // can add more settings here for refreshing data also should add validation step before making calls.
    // The initial call will be too google but then we need to make a call to zype
    mutate(e, {
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
      onSubmit={updateEvent}
      initialValues={fields}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <h2>Update Event</h2>
          <div>
            <label>Event Name</label>
            <Field name="summary" component="input" value={fields.summary} />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
}
