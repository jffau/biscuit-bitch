import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Card, Divider, Page, Spacer, Grid, Text } from "@geist-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Page>
      <Grid.Container gap={4} justify="center">
        <Grid xs={24} md={4}>
          <Link href="/orders" passHref>
            <a>
              <Card hoverable height="100px" style={{ cursor: "pointer" }}>
                <Text b>Place Order</Text>
              </Card>
            </a>
          </Link>
        </Grid>
        <Grid xs={24} md={4}>
          <Link href="/restaurant" passHref>
            <a>
              <Card hoverable height="100px" style={{ cursor: "pointer" }}>
                <Text b>Restaurant</Text>
              </Card>
            </a>
          </Link>
        </Grid>
      </Grid.Container>
    </Page>
  );
}
