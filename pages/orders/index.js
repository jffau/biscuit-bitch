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
import WaitTime from "../../components/WaitTime";
import { useRouter } from "next/router";

const PlaceOrder = () => {
  return (
    <Page dotBackdrop={true}>
      <Page.Header center>
        <Text h3>Place an Order</Text>
      </Page.Header>
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

  const router = useRouter();
  const total = React.useMemo(() => {
    return order.reduce((prev, current) => {
      return (prev += current.price_per_unit * current.quantity);
    }, 0);
  }, [order]);

  const handleOrder = React.useCallback(async () => {
    const items = order.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity),
    }));

    const body = {
      total_price: total,
      items: items,
    };

    try {
      const api = "/api/orders";

      const response = await fetch(api, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const { id } = await response.json();
      router.push(`/orders/${id}`);
    } catch (error) {
      alert("Failed to submit order!");
      console.log(error);
    }
  }, [order, total, router]);

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
      // unchanged items
      const filtered = order.filter((orderItem) => {
        return orderItem.name !== item.name;
      });

      // clear from order if count is 0
      if (e.target.value === "0") {
        setOrder([...filtered]);
        return;
      }

      let updatedItem = {
        name: item.name,
        price_per_unit: item.price_per_unit,
        quantity: e.target.value,
      };

      setOrder([...filtered, updatedItem]);
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
