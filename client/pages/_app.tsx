import '@/styles/globals.css'
import AppProps from "next/app"
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps } />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
