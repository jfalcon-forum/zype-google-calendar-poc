import { google } from "googleapis";

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

// Rewrite this to accept date and time
export function dateTimeForCalendar(startTime, endTime) {
  // format startTime and endTime

  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000`;
  const event = new Date(Date.parse(newDateTime));

  const startDate = event;
  const endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + 1)
  );

  return {
    start: startDate,
    end: endDate,
  };
}

// We'll need to update this function to handle pagination/date time etc...
// The idea is to scale it while also taking into account api limits
export async function getEvents(dateTimeStart, dateTimeEnd) {
  try {
    const response = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "America/Chicago",
    });

    const items = response["data"]["items"];
    return items;
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
}

export async function createEvent(event) {
  // require event properties - end, start, and summary
  try {
    const response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      resource: event,
    });

    if (response["status"] === 200 && response["statusText"] === "OK") {
      return "Event Inserted successfully";
    } else {
      return "Failed to insert event";
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
}

export async function deleteEvent(eventId) {
  try {
    const response = await calendar.events.delete({
      auth: auth,
      calendarId: calendarId,
      eventId: eventId,
    });

    if (response.data === "") {
      return "Event deleted successfully";
    } else {
      return "Error in deleting event";
    }
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error}`);
    return 0;
  }
}

export async function updateEvent(eventId, event) {
  try {
    const response = await calendar.events.update({
      auth: auth,
      calendarId: calendarId,
      eventId: eventId,
      resource: event,
    });

    if (response.date !== "") {
      return response.data;
    } else {
      return "event not updated";
    }
  } catch (error) {
    console.log(`Error at updateEvent --> ${error}`);
    return 0;
  }
}
