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
} from "@geist-ui/react";

const Restaurant = ({ orders }) => {
  console.log("orders", orders);

  const actions = ["received", "preparing", "ready", "pickedup"];
  return (
    <Page>
      <Grid.Container gap={4} justify="center">
        {orders.order.map((order) => {
          return <Order order={order} key={order.id} />;
        })}
      </Grid.Container>
    </Page>
  );
};

const Order = ({ order }) => {
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
        <Description title="Order ID" content={`${order.id}`} />
        <Text>Status: {status}</Text>
        <Table data={order.items}>
          <Table.Column prop="name" label="Item" />
          <Table.Column prop="quantity" label="Quantity" />
        </Table>
        <Spacer />

        <Grid key={"total"} md={12} justify="flex-end" alignItems="flex-end">
          <Description title="total" content={`$${order?.total_price}`} />
        </Grid>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleStatusChange} width="100px">
            {getNextAction()}
          </Button>
        </div>
      </Card>
    </Grid>
  );
};

export default Restaurant;

export async function getServerSideProps(context) {
  const data = {
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
  return {
    props: { orders: data }, // will be passed to the page component as props
  };
}
