import React from "react";
import {
  Grid,
  Page,
  Card,
  Table,
  Button,
  Spacer,
  Text,
  Description,
  useMediaQuery,
} from "@geist-ui/react";
import { QRCodeSVG } from "qrcode.react";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";

configureAbly({
  key: "yeD4yg.SGmWww:B47Df0TYlM7s5LDoZ6NRQHXrqC1XfNhr-J6w3NibPwI",
  clientId: "client-id",
});

const Restaurant = ({ pendingOrders }) => {
  const [orders, setOrders] = React.useState(
    pendingOrders.reduce(
      (acc, curr) => ({ ...acc, [Number(curr.id)]: curr }),
      {}
    )
  );

  const [channel, ably] = useChannel("orders", (message) => {
    console.log(message);
    // setOrders((prev) => ({ ...prev, [Number(message.data.id)]: message.data }));
  });

  React.useEffect(() => {
    const history = channel.history((err, result) => {
      const newOrders = result.items.reduce(
        (acc, curr) => ({ ...acc, [Number(curr.data.id)]: curr }),
        {}
      );

      console.log("newOrders", newOrders);
      setOrders((prev) => ({ ...prev, ...newOrders }));
    });
  }, [channel]);

  console.log(orders);
  const actions = ["received", "preparing", "ready", "pickedup"];
  const isXS = useMediaQuery("xs");

  return (
    <Page width={isXS ? "100%" : undefined} dotBackdrop={true}>
      <Grid.Container gap={4} justify="center">
        {Object.values(orders)?.map((order) => {
          return <Order order={order} key={order.id} />;
        })}
      </Grid.Container>
    </Page>
  );
};

const Order = ({ order, pendingOrder }) => {
  const actions = ["received", "preparing", "ready", "complete"];

  const handleStatusChange = async (id) => {
    const current = actions.indexOf(status);
    const next = current + 1;
    if (next >= actions.length) {
      return;
    }
    setStatus(actions[next]);

    let root =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000`
        : `https://biscuit-bitch.vercel.app`;

    const api = `${root}/api/orders/${id}`;
    const res = await fetch(api, {
      method: "PATCH",
      body: JSON.stringify({ status: actions[next] }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res);
  };

  const getNextAction = () => {
    switch (status) {
      case "received":
        return "Prepare";
      case "preparing":
        return "Ready";
      case "ready":
        return "Complete";
      case "complete":
        return "Done";
        break;
      default:
        return "unknown";
    }
  };
  const [status, setStatus] = React.useState(order.status);

  return (
    <Grid key={order.id} xs={24} md={8} xl={4}>
      <Card shadow width="100%">
        <Grid.Container gap={1} width="100%" height="100%">
          <Grid xs={24}>
            <Description title="Order ID" content={`${order.id}`} />
          </Grid>
          <Grid xs={24}>
            <div style={{ margin: "auto" }}>
              <QRCodeSVG
                value={`https://biscuit-bitch.vercel.app/orders/${order?.id}`}
              />
            </div>
          </Grid>
          <Grid xs={24}>
            <Text>Status: {status}</Text>
          </Grid>
          <Grid xs={24}>
            <Table data={order.items}>
              <Table.Column prop="name" label="Item" />
              <Table.Column prop="quantity" label="Quantity" />
            </Table>
          </Grid>

          <Grid key={"total"} xs={124} justify="flex-end" alignItems="flex-end">
            <Description title="total" content={`$${order?.total_price}`} />
          </Grid>

          <Grid xs={24} justify="center" style={{ alignSelf: "end" }}>
            <Button onClick={() => handleStatusChange(order.id)} width="100px">
              {getNextAction()}
            </Button>
          </Grid>
        </Grid.Container>
      </Card>
    </Grid>
  );
};

export default Restaurant;

export async function getServerSideProps(context) {
  try {
    let root =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000`
        : `https://biscuit-bitch.vercel.app`;

    // TODO: refactor this lol

    const allOrdersApi = `${root}/api/orders/`;
    const allOrdersRes = await fetch(allOrdersApi);
    const allOrders = await allOrdersRes.json();

    const pendingOrdersApi = `${root}/api/orders?pending=true`;
    const pendingOrdersRes = await fetch(pendingOrdersApi);
    const pending = await pendingOrdersRes.json();

    console.log("allOrders", allOrders);
    return {
      props: {
        orders: allOrders.data,
        pendingOrders: pending.data,
      },
    };
  } catch (error) {
    console.error("failed to get orderByID");
    return {
      props: { orders: null },
    };
  }
}
