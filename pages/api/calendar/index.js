import { getEvents, createEvent } from "../../../utils";

export default async function handler(req, res) {
  // need to get this from somewhere or format it somehow; could use pagination
  const start = "2022-10-31T00:00:00.000Z";
  const end = "2022-11-08T23:00:00.000Z";

  try {
    if (req.method === "GET") {
      const response = await getEvents(start, end);
      res.status(200).json(response);
    } else if (req.method === "POST") {
      // middleware to sanitize/fix request
      // let event = req.body
      let event = req.body;
      const response = await createEvent(event);
      res.status(200).json({ message: response });
    } else {
      res.status(200).json({ message: "CRUD not fully developed" });
    }
  } catch (error) {
    console.log(error.message);
  }
}
