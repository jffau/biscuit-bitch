export const handler = (req, res) => {
  // TODO: query order by id in ksql, publish order with updated status in orders channel
  res.status(200).json({
    id: 1,
    status: req.body.status,
    items: [
      {
        name: "burger",
        quantity: 2,
      },
    ],
    price: 19.0,
    esitmated_wait_in_minutes: 10,
  });
};

export default handler;
