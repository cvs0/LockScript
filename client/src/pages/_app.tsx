import { CSSReset, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastProvider } from "react-toast-notifications";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <ColorModeProvider>
            <CSSReset />
            <Component {...pageProps} />
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
  );
}

export default MyApp;
