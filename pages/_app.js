import { GeistProvider, CssBaseline } from "@geist-ui/react";
const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
