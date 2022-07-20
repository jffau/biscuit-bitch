export const handler = (req, res) => {
  // TODO: publish order to orders channel
  res.status(200).json({ ...req.body, id: "1234" });
};

export default handler;
