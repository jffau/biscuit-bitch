import { ORDERS_TABLE, ORDER_KEY_ID_INDEX } from "../constants/dynamo";
import { COMPLETE_STATUS } from "../constants/order";
import { db } from "./dynamodb";

export const getOrderId = () => {
  // HACK: Gives you the illusion of sequential human readable IDs
  return String(Math.floor(Math.random() * (99999 - 10000) + 10000));
};

export const getOrderWaitTime = (orderItemsCount) => {
  // HACK: Gives you the illusion of wait times. never less than 5 minutes
  return Number((Math.random() * 5 * orderItemsCount + 5).toFixed(0));
};

export const getOrderById = async (id) => {
  const { Item } = await db
    .get({
      TableName: ORDERS_TABLE,
      Key: {
        id,
        // HACK: Dynamodb connector requires a sort key and uses the message key as a buffer
        key: new Buffer("id"),
      },
    })
    .promise();

  return Item;
};

export const getOrders = async (pending) => {
  const options = {
    TableName: ORDERS_TABLE,
    KeyConditionExpression: "#key = :key",
    // HACK: All orders have the same key so this is essentially a dynamodb scan, just a little faster
    IndexName: ORDER_KEY_ID_INDEX,
    ScanIndexForward: true,
    ExpressionAttributeNames: {
      "#key": "key",
    },
    ExpressionAttributeValues: {
      ":key": new Buffer("id"),
    },
  };

  // Only gets the pending orders
  if (pending) {
    options.FilterExpression = "NOT contains(#status, :status)";
    options.ExpressionAttributeNames["#status"] = "status";
    options.ExpressionAttributeValues[":status"] = COMPLETE_STATUS;
  }

  // Gets all of the orders out of the DB
  let nextCursor;
  const orders = [];
  do {
    const { Items = [], LastEvaluatedKey } = await db
      .query({
        ...options,
        ExclusiveStartKey: nextCursor,
      })
      .promise();

    orders.push(...Items);

    nextCursor = LastEvaluatedKey;
  } while (nextCursor);

  return orders;
};
