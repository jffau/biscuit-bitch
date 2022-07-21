export const handler = (req, res) => {
  // TODO: query orders in ksql that don't have a "completed" status if query param pending = true
  res.status(200).json({
    data: [
      {
        id: "1",
        status: "preparing",
        items: [
          {
            name: "burger",
            quantity: 3,
          },
        ],
        total_price: 19.0,
        estimated_wait_in_minutes: 10,
      },
      {
        id: "2",
        status: "ready_for_pickup",
        items: [
          {
            name: "fries",
            quantity: 1,
          },
        ],
        total_price: 4.0,
        estimated_wait_in_minutes: 5,
      },
      {
        id: "3",
        status: "recieved",
        items: [
          {
            name: "burger",
            quantity: 1,
          },
          {
            name: "fries",
            quantity: 1,
          },
          {
            name: "soda",
            quantity: 1,
          },
        ],
        total_price: 25.0,
        estimated_wait_in_minutes: 15,
      },
    ],
  });
};

export default handler;
