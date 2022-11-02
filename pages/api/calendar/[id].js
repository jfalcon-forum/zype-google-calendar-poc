import { deleteEvent, updateEvent } from "../../../utils";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === "PUT") {
      // Need to format req.body
      // let event = req.body
      let event = req.body;
      const response = await updateEvent(id, event);
      res.status(200).json(response);
    } else if (req.method === "DELETE") {
      const response = await deleteEvent(id);
      res.status(200).json({ message: response });
    } else {
      res.status(200).json({ message: "CRUD not fully developed" });
    }
  } catch (error) {
    console.log(error.message);
  }
}
