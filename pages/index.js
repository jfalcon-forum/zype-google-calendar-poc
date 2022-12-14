import Head from "next/head";
import Image from "next/image";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import Container from "@mui/material/Container";
import Event from "../components/event";
import NewEvent from "../components/newEvent";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

import axios from "axios";

import { useState } from "react";
import { dehydrate, QueryClient, useQuery, isError } from "react-query";

export default function Home() {
  const [events, setEvents] = useState("");

  // staletime set at 10000 aka every 10 second refresh
  // If left idle, 166 users would need to all be on the page to go over max api quota
  const { data, isLoading, isError, error } = useQuery(
    "events",
    async () => {
      const response = await axios("/api/calendar");
      return response.data;
    },
    { staleTime: 10000 }
  );

  if (isLoading) {
    console.log("Loading");
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log("error: ", error);
    return <div>Errors </div>;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <h1>Calendar App</h1>
          <Link
            href={
              "https://calendar.google.com/calendar/u/0/embed?src=076505a01a2e082fd52dc02e70a59bb22735e7cf6ab07193800533d2a97cdd6f@group.calendar.google.com&ctz=America/North_Dakota/Center"
            }
            target="_blank"
          >
            Link to Google Calendar
          </Link>
          {data && data.map((event, i) => <Event key={i} event={event} />)}
          <Divider variant="middle" />
          <NewEvent />
        </Container>
      </main>
    </div>
  );
}
