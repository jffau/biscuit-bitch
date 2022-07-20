import { GeistProvider, CssBaseline, Text } from "@geist-ui/react";
import Link from "next/link";
const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider>
      <nav style={{ padding: "12px 10%", cursor: "pointer" }}>
        <Link href="/" passHref>
          <a>
            <Text h2 b>
              Biscuit Bitch
            </Text>
          </a>
        </Link>
      </nav>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
