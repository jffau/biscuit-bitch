export const handler = (req, res) => {
  // TODO: query order by id in ksql
  res.status(200).json({
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
  });
};

export default handler;
