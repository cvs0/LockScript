import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

/**
 * A wrapper component for forms with Chakra UI styling.
 * @param {Object} props - The properties for the FormWrapper component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by FormWrapper.
 * @param {BoxProps} props - Additional BoxProps from Chakra UI.
 * @returns {React.ReactNode} - The FormWrapper component with Chakra UI styling.
 */
function FormWrapper({
  children,
  ...props
}: { children: React.ReactNode } & BoxProps) {
  return (
    <Box
      // Set the width to 100%.
      w="100%"
      // Set the maximum width based on screen size.
      maxW={{ base: "full", md: "container.sm" }}
      // Apply a box shadow.
      boxShadow="lg"
      // Set padding based on screen size.
      p={{ base: 4, md: 8 }}
      // Apply rounded corners.
      rounded="md"
      // Treat the component as a form.
      as="form"
      // Spread additional BoxProps from Chakra UI.
      {...props}
    >
      {children}
    </Box>
  );
}

// Export the FormWrapper component as the default export for this module.
export default FormWrapper;
