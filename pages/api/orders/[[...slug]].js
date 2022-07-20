import getOrders from "./get-orders";
import getOrderById from "./get-orders-id";
import patchOrderById from "./patch-orders-id";
import postOrders from "./post-orders";

export const handler = (req, res) => {
  // TODO: consider using server/package to handle API routing
  switch (req.method) {
    case "GET":
      if (req?.query?.slug) {
        return getOrderById(req, res);
      } else {
        return getOrders(req, res);
      }
    case "PATCH":
      return patchOrderById(req, res);
    case "POST":
      return postOrders(req, res);
    default:
      res.status(404).json({ message: "Not found." });
  }
};

export default handler;
