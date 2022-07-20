import getOrders from "./get-orders";
import getOrderById from "./get-orders-id";
import patchOrderById from "./patch-orders-id";
import postOrders from "./post-orders";

export const handler = (req, res) => {
  // TODO: consider using server/package to handle API routing
  switch (req.method) {
    case "GET":
      if (req?.query?.slug) {
        getOrderById(req, res);
      } else {
        getOrders(req, res);
      }
      break;
    case "PATCH":
      patchOrderById(req, res);
      break;
    case "POST":
      postOrders(req, res);
      break;
    default:
      res.status(404).json({ message: "Not found." });
  }
};

export default handler;
