import React from "react";
import { useRouter } from "next/router";
import {
  Page,
  Grid,
  Table,
  Text,
  Spacer,
  Card,
  Divider,
  useMediaQuery,
  Description,
} from "@geist-ui/react";
import { QRCodeSVG } from "qrcode.react";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";

configureAbly({
  key: "yeD4yg.SGmWww:B47Df0TYlM7s5LDoZ6NRQHXrqC1XfNhr-J6w3NibPwI",
  clientId: "client-id",
});

const TrackOrder = ({ initialOrder }) => {
  console.log("initialOrder", initialOrder);
  const router = useRouter();
  const { id } = router.query;

  const isXS = useMediaQuery("xs");

  const [order, setOrder] = React.useState(initialOrder ?? null);

  const [channel, ably] = useChannel("orders", (message) => {
    // TODO: listen for update, update status
  });

  const history = channel.history((err, result) => {
    // result contains messages from last 2 minutes
    const { data } = result.items.find((item) => item.data.id === id);
    if (!order) {
      console.log("setting order from history");
      setOrder(data);
    }
  });

  const status = order?.status ?? "unknown";

  const getStatusText = (status) => {
    switch (status) {
      case "unknown":
        return null;
      case "recieved":
        return (
          <Text>
            {`Your order is recieved. We will let you know when it is being made.`}
          </Text>
        );
      case "preparing":
        return <Text>{`Your order is being prepared!`}</Text>;
      case "ready":
        return (
          <Text>{`Your order is ready! Please proceed to the pick up area. 
You can provide order ID or qr code for confirmation.`}</Text>
        );
      case "completed":
        return <Text>{`Thanks for picking up your order! Enjoy!`}</Text>;
      default:
        return null;
    }
  };

  return (
    <Page width={isXS ? "100%" : undefined} dotBackdrop={true}>
      <Text h3>Thank You!</Text>
      <Text>
        Order Details for order{" "}
        <Text span type="success">
          {id}
        </Text>
      </Text>
      <Spacer />
      <Grid.Container>{getStatusText(status)}</Grid.Container>
      <Card>
        <Table data={order?.items ?? []}>
          <Table.Column prop="name" label="Item" />
          <Table.Column prop="quantity" label="Quantity" />
        </Table>
        <Spacer />
        <Grid.Container width="90%" justify="flex-end">
          <Description title="total" content={`$${order?.total_price}`} />
        </Grid.Container>
        <Spacer h={2} />
        <Grid.Container justify="center">
          <QRCodeSVG value={`https://biscuit-bitch.vercel.app/orders/${id}`} />
        </Grid.Container>
      </Card>
    </Page>
  );
};

export default TrackOrder;

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    let root =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000`
        : `https://biscuit-bitch.vercel.app`;
    const api = `${root}/api/orders/${id}`;
    const res = await fetch(api);
    const data = await res.json();
    if (res.status === 200)
      return {
        props: { initialOrder: data }, // will be passed to the page component as props
      };
    else {
      return {
        props: { initialOrder: null },
      };
    }
  } catch (error) {
    console.error("failed to get orderByID");
    return {
      props: { initialOrder: null },
    };
  }
}
