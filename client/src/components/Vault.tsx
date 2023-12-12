/* eslint-disable react/jsx-no-undef */
import {
  FaArrowAltCircleDown,
  FaArrowCircleRight,
  FaCog,
  FaCopy,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaSync,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import * as jwt_decode from 'jwt-decode';
import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { encryptVault } from "../crypto";
import { useMutation } from "react-query";
import { saveVault } from "../api";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CountryDropdownProps {
  onSelect: (selectedCountry: string) => void;
}
function CountryDropdown({ onSelect }: CountryDropdownProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [searchTerm] = useState<string>("");
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data.map(
          (country: {
            name: {
              common: string;
            };
          }) => country.name.common
        );

        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedCountries = filteredCountries.sort();
  return (
    <Select
      placeholder="Select a country"
      onChange={(e) => onSelect(e.target.value)}
    >
      {" "}
      {sortedCountries.map((country, index) => (
        <option key={index} value={country}>
          {" "}
          {country}{" "}
        </option>
      ))}{" "}
    </Select>
  );
}

function Vault({
  vault = [],
  vaultKey = "",
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      vault,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "vault" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState("");
  const [notification, setNotification] = useState(true);
  const [showPasswordOptions, setShowPasswordOptions] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
  const [includeUppercaseChars, setIncludeUppercaseChars] = useState(false);
  const [copyToClipboard, setCopyToClipboard] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = (
    index: any,
    includeSpecialChars: boolean,
    uppercase: boolean,
    passwordLength: number,
    copyToClipboard: boolean,
  ) => {
    let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    let uppercaseCharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    if (includeSpecialChars) {
      if(uppercase) {
        uppercaseCharset += "!@#$%^&*()-_+=<>?/{}[]|";
      } else {
        charset += "!@#$%^&*()-_+=<>?/{}[]|";
      }
    }

    let password = "";

    for (let i = 0; i < passwordLength; i++) {
      if(uppercaseCharset) {
        const randomIndex = Math.floor(Math.random() * uppercaseCharset.length);
        password += uppercaseCharset.charAt(randomIndex);
      } else {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }
    }
    
    setValue(`vault.${index}.password`, password);

    if (copyToClipboard) {
      const textarea = document.createElement("textarea");
      textarea.value = password;
      document.body.appendChild(textarea);

      textarea.select();
      document.execCommand("copy");

      document.body.removeChild(textarea);
    }

    setShowPasswordOptions(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedSettings = sessionStorage.getItem("settings");
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);

          setDarkMode(parsedSettings.darkMode);
          setNotification(parsedSettings.notification);
          setLocation(parsedSettings.location);
        }
      } catch (error) {
        console.error("Error setting email:", error);
      }
    };

    fetchData();
  }, []);

  const handleGoToWebsite = (website: string) => {
    if (website) {
      window.open(website, "_blank");
    }
  };

  const handleCopy = (fieldValue: string) => {
    if (fieldValue) {
      const tempInput = document.createElement("input");
      tempInput.value = fieldValue;
      document.body.appendChild(tempInput);

      tempInput.select();
      document.execCommand("copy");

      document.body.removeChild(tempInput);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  const Notification = ({ text }: { text: string }) => (
    <div
      style={{
        position: "fixed",
        bottom: `${
          10 + document.querySelectorAll(".notification").length * 70
        }px`,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "green",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        transition: "bottom 0.5s ease",
      }}
      className="notification"
    >
      {text}
    </div>
  );

  const saveSettingsToSessionStorage = () => {
    const settings = {
      darkMode,
      notification,
      location,
    };

    sessionStorage.setItem("settings", JSON.stringify(settings));
  };

  const mutation = useMutation(saveVault);
  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.reload();
  };
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toggleColorMode();
    saveSettingsToSessionStorage();
  };

  const cookieString = document.cookie;
  const tokenCookie = cookieString
    .split('; ')
    .find((cookie) => cookie.startsWith('token='));

  // Extract the token value from the cookie
  const token = tokenCookie ? tokenCookie.split('=')[1] : null;

  // Log the retrieved token
  console.log('Retrieved Token:', token);
  let userid: string = '';
  let email: string = '';

  // Check if the token is present and is a string
  if (!token || typeof token !== 'string') {
    console.error("Invalid or missing token");
    // Handle the case where the token is invalid or missing
  } else {
    try {
      const decodedToken: any = jwtDecode(token);

      console.log('Decoded Token:', decodedToken);

      const userId = decodedToken?._id;
      const userEmail = decodedToken?.email;

      let userid = userId;
      let email = userEmail;

      console.log('userid: ', userid);
      console.log('email: ', email);

      if (!userId) {
        console.error("Invalid user ID in token");
      } else {
        console.log("User ID:", userId);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <FormWrapper
      onSubmit={handleSubmit(({ vault }) => {
        console.log({ vault });
        const encryptedVault = encryptVault({
          vault: JSON.stringify({ vault }),
          vaultKey,
        });
        window.sessionStorage.setItem("vault", JSON.stringify(vault));
        mutation.mutate({ encryptedVault });
      })}
    >
      <Modal
        isOpen={showPasswordOptions}
        onClose={() => setShowPasswordOptions(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Password Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Password Length Slider */}
            <FormControl>
              <FormLabel>Password Length</FormLabel>
              <Slider
                aria-label="password-length-slider"
                value={passwordLength}
                onChange={(value) => setPasswordLength(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Input
                type="number"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                mt={2}
              />
            </FormControl>
            {/* Include other password options like special characters, numbers, etc. */}
            <Stack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="includeSpecialChars" mb="0">
                  Include Special Characters
                </FormLabel>
                <Switch
                  id="includeSpecialChars"
                  isChecked={includeSpecialChars}
                  onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="includeUppercaseChars" mb="0">
                  Include Uppercase Characters
                </FormLabel>
                <Switch
                  id="includeUppercaseChars"
                  isChecked={includeUppercaseChars}
                  onChange={() => setIncludeUppercaseChars(!includeUppercaseChars)}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="copyToClipboard" mb="0">
                  Copy to Clipboard
                </FormLabel>
                <Switch
                  id="copyToClipboard"
                  isChecked={copyToClipboard}
                  onChange={() => setCopyToClipboard(!copyToClipboard)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() =>
                handleGeneratePassword(
                  currentItemIndex,
                  includeSpecialChars,
                  includeUppercaseChars,
                  passwordLength,
                  copyToClipboard
                )
              }
            >
              Generate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        position="fixed"
        top="4"
        right="4"
        display="flex"
        alignItems="center"
      >
        <Menu>
          <MenuButton as={Button} bg="transparent">
            <Avatar size="sm" icon={<FaUser />} />
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Button
                leftIcon={<FaCog />}
                variant="ghost"
                onClick={() => setIsSettingsOpen(true)}
              >
                Settings
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="ghost"
                onClick={() => handleLogout()}
              >
                Log Out
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="2px"
            p="6"
            fontSize="2xl"
            fontWeight="extrabold"
            color="white"
            bgGradient="linear(to-r, teal.500, teal.300)"
            boxShadow="md"
            textAlign="center"
          >
            Settings
          </DrawerHeader>

          <DrawerBody>
            {/* Appearance Section */}
            <Flex align="center" justify="space-between" mb="2">
              <Button
                variant="link"
                fontSize="lg"
                fontWeight="bold"
                onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                rightIcon={
                  isAppearanceOpen ? (
                    <FaArrowAltCircleDown />
                  ) : (
                    <FaArrowCircleRight />
                  )
                }
              >
                Appearance
              </Button>
            </Flex>

            <Collapse in={isAppearanceOpen}>
              <div>
                <FormControl display="flex" alignItems="center" mb="4">
                  <FormLabel htmlFor="darkMode" mb="0">
                    Dark Mode
                  </FormLabel>
                  <Switch
                    id="darkMode"
                    isChecked={colorMode === "dark"}
                    onChange={handleDarkModeToggle}
                  />
                </FormControl>
              </div>
            </Collapse>

            {/* Notification Section */}
            <Flex align="center" justify="space-between" mb="2">
              <Button
                variant="link"
                fontSize="lg"
                fontWeight="bold"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                rightIcon={
                  isNotificationOpen ? (
                    <FaArrowAltCircleDown />
                  ) : (
                    <FaArrowCircleRight />
                  )
                }
              >
                Notifications
              </Button>
            </Flex>

            <Collapse in={isNotificationOpen}>
              <div>
                <FormControl display="flex" alignItems="center" mb="4">
                  <FormLabel htmlFor="notification" mb="0">
                    Notifications
                  </FormLabel>
                  <Switch
                    id="notification"
                    isChecked={notification}
                    onChange={() => setNotification(!notification)}
                  />
                </FormControl>
              </div>
            </Collapse>

            {/* Security Section */}
            <Flex align="center" justify="space-between" mb="2">
              <Button
                variant="link"
                fontSize="lg"
                fontWeight="bold"
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                rightIcon={
                  isSecurityOpen ? (
                    <FaArrowAltCircleDown />
                  ) : (
                    <FaArrowCircleRight />
                  )
                }
              >
                Security
              </Button>
            </Flex>

            <Collapse in={isSecurityOpen}>
              <div>
                <FormControl mb="4">
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <CountryDropdown
                    onSelect={(selectedCountry) => setLocation(selectedCountry)}
                  />
                </FormControl>
              </div>
            </Collapse>

            <Collapse in={isSecurityOpen}>
              <div>
                <FormControl mb="4">
                  <FormLabel htmlFor="deleteAccount">Delete Account</FormLabel>
                  <Button
                    leftIcon={<FaTrash />}
                    onClick={() => (console.log('hi'))}
                  >
                    Delete
                  </Button>
                </FormControl>
              </div>
            </Collapse>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {fields.map((field, index) => {
        return (
          <Box
            mt="4"
            mb="4"
            display="flex"
            key={field.id}
            alignItems="flex-end"
          >
            <FormControl>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                type="url"
                id="website"
                placeholder="Website"
                {...register(`vault.${index}.website`, {
                  required: "Website is required.",
                })}
              />
            </FormControl>

            <Button
              type="button"
              ml="2"
              onClick={() => handleGoToWebsite(field.website)}
              variant="ghost"
            >
              <FaExternalLinkAlt />
            </Button>
            <FormControl ml="2">
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                {...register(`vault.${index}.username`, {
                  required: "Username is required.",
                })}
              />
            </FormControl>
            <Button
              type="button"
              ml="2"
              onClick={() => handleCopy(getValues(`vault.${index}.username`))}
              variant="ghost"
            >
              <FaCopy />
            </Button>
            <FormControl ml="2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type={showPasswords ? "text" : "password"}
                id="password"
                placeholder="Password"
                {...register(`vault.${index}.password`, {
                  required: "Password is required.",
                })}
              />
            </FormControl>
            <Button
              type="button"
              ml="2"
              onClick={() => handleCopy(getValues(`vault.${index}.password`))}
              variant="ghost"
            >
              <FaCopy />
            </Button>
            <Button
              type="button"
              bg="red.500"
              color="white"
              fontSize="2xl"
              ml="2"
              onClick={() => remove(index)}
            >
              <FaTimes />
            </Button>
            <Button
              type="button"
              bg="green.500"
              color="white"
              fontSize="2xl"
              ml="2"
              onClick={() => {
                setShowPasswordOptions(true);
                setCurrentItemIndex(index);
              }}
            >
              <FaSync />
            </Button>
            {copied && notification && <Notification text="Copied!" />}
          </Box>
        );
      })}
      <Button
        onClick={() => append({ website: "", username: "", password: "" })}
        aria-label="Add new entry"
      >
        Add
      </Button>
      <Button ml="8" type="submit">
        Save vault
      </Button>
      <Button ml="8" onClick={() => setShowPasswords(!showPasswords)}>
        {" "}
        {showPasswords ? "Hide Passwords" : "Show Passwords"}{" "}
      </Button>
    </FormWrapper>
  );
}
export default Vault;
