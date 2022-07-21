import { client } from "../../../utils/ably";
import { ORDER, ORDERS_CHANNEL } from "../../../constants/ably";
import { getOrderId, getOrderWaitTime } from "../../../utils/order";
import { PREPARING_STATUS } from "../../../constants/order";

export const handler = (req, res) => {
  try {
    console.log("Submitting order.", req.body);

    /*
        Payload:
        {   
        "items": [{ 
            "name": "burger", 
            "quantity": 2
        }], 
        "total_price": 19.0
        }
    */
    const order = {
      ...req.body,
      id: getOrderId(),
      status: "received",
      estimated_wait_in_minutes: getOrderWaitTime(req.body.items.length),
    };

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
  } catch (e) {
    console.error("ERROR, failed to publish message to orders channel.", e);
    res.status(500).json({
      message: "An internal server error occurred, please try again.",
    });
  }
};

export default handler;
