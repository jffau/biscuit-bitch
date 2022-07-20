import { client } from "../../../utils/ably";
import { ORDER, ORDERS_CHANNEL } from "../../../constants/ably";

export const handler = (req, res) => {
  res.status(200).json({ ...req.body, id: "1234" });

  return;

  // TODO
  const order = {};

  const channel = client.channels.get(ORDERS_CHANNEL);

  channel.publish(ORDER, order, (error) => {
    if (error) {
      console.error("ERROR, failed to publish message to orders channel.", e);
      res.status(500).json({
        message: "An internal server error occurred, please try again.",
      });
    } else {
      console.log("Successfully published to Ably.");
      res.status(200).json(order);
    }
  });
};

export default handler;
