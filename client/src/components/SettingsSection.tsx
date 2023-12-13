import React, { ReactNode } from 'react';
import { Box, Button, Collapse, Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { FaArrowAltCircleDown, FaArrowCircleRight } from 'react-icons/fa';

interface SettingsSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <Box
      p="4"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      mb="4"
      _hover={{
        boxShadow: 'md',
      }}
    >
      <Flex align="center" justify="space-between" mb="3">
        <Button
          variant="link"
          fontSize="xl"
          fontWeight="semibold"
          color={isOpen ? 'teal.500' : 'black'}
          onClick={onToggle}
          rightIcon={isOpen ? <FaArrowAltCircleDown /> : <FaArrowCircleRight />}
        >
          {title}
        </Button>
      </Flex>

      <Collapse in={isOpen} style={{ marginTop: '1rem' }}>
        <Box>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default SettingsSection;
