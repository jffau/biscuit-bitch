import { getOrderById } from "../../../utils/order";

export const handler = async (req, res) => {
  try {
    const {
      slug: [id],
    } = req.query;

    console.log("Getting order.", id);

    const order = await getOrderById(id);

    if (!order) {
      console.log("Order not found.");
      res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (e) {
    console.error("ERROR, failed to get order.", e);
    res.status(500).json({ message: "Failed to get order." });
  }
};

export default handler;
