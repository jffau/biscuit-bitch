import { client } from "../../../utils/ably";
import { ORDER, ORDERS_CHANNEL } from "../../../constants/ably";
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
      res.status(404).json({ message: "Cannot update an order that does not exist" });
    }

    const updatedStatus = req.body.status;
    const updatedOrder = {
      ...order,
      status: updatedStatus
    };

    console.log("Submitting updated order", updatedOrder);

    const channel = client.channels.get(ORDERS_CHANNEL);
    channel.publish(ORDER, updatedOrder, (error) => {
      if (error) {
        console.error("ERROR, failed to publish message to orders channel.", e);
        res.status(500).json({
          message: "An internal server error occurred, please try again.",
        });
      } else {
        console.log("Successfully published to Ably.");
        res.status(200).json(updatedOrder);
      }
    });
    
  } catch (e) {
    console.error("ERROR, failed to get order.", e);
    res.status(500).json({ message: "Failed to update order." });
  }
};

export default handler;
