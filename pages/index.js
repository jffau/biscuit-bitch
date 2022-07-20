import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Card, Divider, Spacer } from "@geist-ui/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Spacer h={10} />
      <Card hoverable>Order!</Card>
      <Divider />
      <Card hoverable>Restaurant View</Card>
    </div>
  );
}
