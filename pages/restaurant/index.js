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

const Restaurant = ({ orders, pendingOrders }) => {
  const actions = ["received", "preparing", "ready", "pickedup"];
  const isXS = useMediaQuery("xs");
  console.log("pendingOrders", pendingOrders);
  return (
    <Page width={isXS ? "100%" : undefined} dotBackdrop={true}>
      <Grid.Container gap={4} justify="center">
        {pendingOrders?.map((order) => {
          return <Order order={order} key={order.id} />;
        })}
      </Grid.Container>
    </Page>
  );
};

const Order = ({ order, pendingOrder }) => {
  const actions = ["received", "preparing", "ready", "pickedup"];

  const handleStatusChange = () => {
    const current = actions.indexOf(status);
    const next = current + 1;
    if (next >= actions.length) {
      return;
    }
    setStatus(actions[next]);

    // TODO: make api call
  };

  const getNextAction = () => {
    switch (status) {
      case "received":
        return "Prepare";
      case "preparing":
        return "Ready";
      case "ready":
        return "Complete";
      case "pickedup":
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
            <Button onClick={handleStatusChange} width="100px">
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
  const mock = {
    order: [
      {
        id: "1",
        status: "preparing",
        items: [
          {
            name: "burger",
            quantity: 2,
          },
        ],
        total_price: 19.0,
        estimated_wait_in_minutes: 10,
      },
      {
        id: "2",
        status: "ready",
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
        status: "received",
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
  };

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
