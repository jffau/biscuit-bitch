import { getOrders } from "../../../utils/order";

export const handler = async (req, res) => {
  try {
    console.log("Getting orders.", req.query);

    const orders = await getOrders(req.query.pending);

    res.status(200).json({ data: orders });
  } catch (e) {
    console.error("ERROR, failed to get orders.", e);
    res.status(500).json({
      message: "An internal server error occurred, please try again.",
    });
  }
};

export default handler;
