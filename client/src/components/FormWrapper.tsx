import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

function FormWrapper({
  children,
  ...props
}: { children: React.ReactNode } & BoxProps) {
  return (
    <Box
      w="100%"
      maxW={{ base: "full", md: "container.sm" }}
      boxShadow="lg"
      p={{ base: 4, md: 8 }}
      rounded="md"
      as="form"
      {...props}
    >
      {children}
    </Box>
  );
}

export default FormWrapper;
