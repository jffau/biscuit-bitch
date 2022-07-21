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
} from "@geist-ui/react";
import { QRCodeSVG } from "qrcode.react";

const TrackOrder = ({ initialStatus }) => {
  const [status, setStatus] = React.useState(
    initialStatus?.status ?? "unknown"
  );
  const router = useRouter();
  const { id } = router.query;
  const data = initialStatus.items;
  const isXS = useMediaQuery("xs");

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
        <Table data={data}>
          <Table.Column prop="name" label="Item" />
          <Table.Column prop="quantity" label="Quantity" />
        </Table>

        <Spacer h={2} />
        <QRCodeSVG value={`https://biscuit-bitch.vercel.app/orders/${id}`} />
      </Card>
    </Page>
  );
};

export default TrackOrder;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const api = `http://localhost:3000/api/orders/${id}`;
  const res = await fetch(api);
  const data = await res.json();

  return {
    props: { initialStatus: data }, // will be passed to the page component as props
  };
}
