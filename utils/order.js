export const getOrderId = () => {
  // HACK: Gives you the illusion of sequential human readable IDs
  return String(Math.floor(Math.random() * (99999 - 10000) + 10000));
};

export const getOrderWaitTime = (orderItemsCount) => {
  // HACK: Gives you the illusion of wait times. never less than 5 minutes
  return Number((Math.random() * 5 * orderItemsCount + 5).toFixed(0));
};
