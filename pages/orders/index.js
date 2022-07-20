import React from "react";
import {
  Page,
  Text,
  Grid,
  Card,
  Button,
  Input,
  Description,
  Spacer,
} from "@geist-ui/react";
import PageHeader from "@geist-ui/react/esm/page/page-header";
import WaitTime from "../../components/WaitTime";

const PlaceOrder = () => {
  return (
    <Page dotBackdrop={true}>
      <PageHeader center>
        <Text h3>Place an Order</Text>
      </PageHeader>
      <WaitTime />
      <Page.Content>
        <OrderForm />
      </Page.Content>
    </Page>
  );
};

const OrderForm = () => {
  const items = [
    {
      name: "BitchWitch",
      price_per_unit: 6.5,
    },
    { name: "Hot Mess", price_per_unit: 12.0 },
    { name: "Easy Bitch", price_per_unit: 8.5 },
  ];
  const [order, setOrder] = React.useState([]);

  const handleOrder = React.useCallback(async () => {
    //TODO:  make request to POST /orders here
    console.log("place order: ", order);
  }, [order]);

  const total = React.useMemo(() => {
    return order.reduce((prev, current) => {
      return (prev += current.price_per_unit);
    }, 0);
  }, [order]);

  return (
    <>
      <Grid.Container gap={3} width="80%">
        {items.map((item) => (
          <Grid key={item.name} md={12}>
            <MenuItem item={item} order={order} setOrder={setOrder} />
          </Grid>
        ))}
        <Grid key={"total"} md={12} justify="flex-end" alignItems="flex-end">
          <Description title="total" content={`$${total}`} />
        </Grid>
      </Grid.Container>

      <Spacer h={3} />
      <Grid.Container>
        <Grid xs={24} justify="center">
          <Button onClick={handleOrder} disabled={order.length === 0}>
            Order
          </Button>
        </Grid>
      </Grid.Container>
    </>
  );
};

const MenuItem = ({ item, order, setOrder }) => {
  const [count, setCount] = React.useState(0);
  const handleCountChange = React.useCallback(
    (e) => {
      setCount(e.target.value);
      const filtered = order.filter((orderItem) => {
        return orderItem.name !== item.name;
      });
      let addedItems = [];

      for (let i = 0; i < e.target.value; i++) {
        addedItems.push({
          name: item.name,
          price_per_unit: item.price_per_unit,
        });
      }
      setOrder([...filtered, ...addedItems]);
    },
    [order, setOrder, item]
  );

  return (
    <Card width={"100%"}>
      <Text>{item.name}</Text>
      <Text>Price: ${item.price_per_unit}</Text>
      <Input
        label="Quantity"
        width="200px"
        value={count}
        onChange={handleCountChange}
        htmlType="number"
        min={0}
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
      />
    </Card>
  );
};

export default PlaceOrder;
