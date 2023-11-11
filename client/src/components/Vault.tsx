/* eslint-disable react/jsx-no-undef */
import {
    FaCog,
    FaSignOutAlt,
    FaSync,
    FaTimes,
    FaUser
} from "react-icons/fa";
import {useFieldArray, useForm} from "react-hook-form";
import {VaultItem} from "../pages";
import FormWrapper from "./FormWrapper";
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormLabel,
    Input,
    Link,
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
    Stack,
    Switch
} from "@chakra-ui/react";
import {encryptVault} from "../crypto";
import {useMutation} from "react-query";
import {saveVault} from "../api";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
interface CountryDropdownProps {
    onSelect: (selectedCountry : string) => void;
}
function CountryDropdown({onSelect} : CountryDropdownProps) {
    const [countries, setCountries] = useState < string[] > ([]);
    const [searchTerm, setSearchTerm] = useState < string > ('');
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                const countryList = data.map((country : {
                    name: {
                        common: string
                    }
                }) => country.name.common);
                setCountries(countryList);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);
    const filteredCountries = countries.filter(country => country.toLowerCase().includes(searchTerm.toLowerCase()));
    const sortedCountries = filteredCountries.sort();
    return (<Select placeholder="Select a country"
        onChange={
            (e) => onSelect(e.target.value)
    }> {
        sortedCountries.map((country, index) => (<option key={index}
            value={country}> {country} </option>))
    } </Select>);
}


function Vault({
    vault = [],
    vaultKey = ""
} : {
    vault : VaultItem[];
    vaultKey : string;
}) {
    const {control, register, handleSubmit, setValue} = useForm({defaultValues: {
            vault
        }});
    const {fields, append, remove} = useFieldArray({control, name: "vault"});
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [location, setLocation] = useState("");
    const [notification, setNotification] = useState(false);
    const [showPasswordOptions, setShowPasswordOptions] = useState(false);
    const [passwordLength, setPasswordLength] = useState(12); // Default length is 12
    const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
    const [copyToClipboard, setCopyToClipboard] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState < number | null > (null);
    const handleGeneratePassword = (index : any, includeSpecialChars : boolean, passwordLength : number, copyToClipboard : boolean) => {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (includeSpecialChars) {
            charset += "!@#$%^&*()-_+=<>?/{}[]|";
        }
        let password = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
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
    const mutation = useMutation(saveVault);
    const handleLogout = () => {
        window.sessionStorage.clear();
        window.location.reload();
    };
    return (<FormWrapper onSubmit={
        handleSubmit(({vault}) => {
            console.log({vault});
            const encryptedVault = encryptVault({
                vault: JSON.stringify({vault}),
                vaultKey
            });
            window.sessionStorage.setItem('vault', JSON.stringify(vault));
            mutation.mutate({encryptedVault});
        })
    }>
        <Modal isOpen={showPasswordOptions}
            onClose={
                () => setShowPasswordOptions(false)
        }>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Password Options</ModalHeader>
                <ModalCloseButton/>
                <ModalBody> {/* Password Length Input */}
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel>Password Length</FormLabel>
                            <Input type="number" placeholder="Enter length"
                                value={passwordLength}
                                onChange={
                                    (e) => setPasswordLength(Number(e.target.value))
                                }/>
                        </FormControl>
                        {/* Include other password options like special characters, numbers, etc. */}
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="includeSpecialChars" mb="0">
                                Include Special Characters
                            </FormLabel>
                            <Switch id="includeSpecialChars"
                                isChecked={includeSpecialChars}
                                onChange={
                                    () => setIncludeSpecialChars(!includeSpecialChars)
                                }/>
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="copyToClipboard" mb="0">
                                Copy to Clipboard
                            </FormLabel>
                            <Switch id="copyToClipboard"
                                isChecked={copyToClipboard}
                                onChange={
                                    () => setCopyToClipboard(!copyToClipboard)
                                }/>
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue"
                        mr={3}
                        onClick={
                            () => setShowPasswordOptions(false)
                    }>
                        Close
                    </Button>
                    <Button colorScheme="green"
                        onClick={
                            () => handleGeneratePassword(currentItemIndex, includeSpecialChars, passwordLength, copyToClipboard)
                    }>
                        Generate
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <Box position="absolute" top="4" right="4" display="flex" alignItems="center">
            <Menu>
                <MenuButton as={Button}
                    bg="transparent">
                    <Avatar size="sm"
                        icon={<FaUser/>}/>
                </MenuButton>
                <MenuList>
                    <MenuItem>
                        <Button leftIcon={<FaCog/>}
                            variant="ghost"
                            onClick={
                                () => setIsSettingsOpen(true)
                        }>
                            Settings
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button leftIcon={<FaSignOutAlt/>}
                            variant="ghost"
                            onClick={
                                () => handleLogout()
                        }>
                            Log Out
                        </Button>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
        <Drawer isOpen={isSettingsOpen}
            onClose={
                () => setIsSettingsOpen(false)
            }
            placement="right">
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader>Settings</DrawerHeader>
                <DrawerBody>
                    <FormControl display="flex" alignItems="center" mb="4">
                        <FormLabel htmlFor="darkMode" mb="0">
                            Dark Mode
                        </FormLabel>
                        <Switch id="darkMode"
                            isChecked={darkMode}
                            onChange={
                                () => setDarkMode(!darkMode)
                            }/>
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mb="4">
                        <FormLabel htmlFor="notification" mb="0">
                            Notifications
                        </FormLabel>
                        <Switch id="notification"
                            isChecked={notification}
                            onChange={
                                () => setNotification(!notification)
                            }/>
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel htmlFor="country">Country</FormLabel>
                        <CountryDropdown onSelect={
                            (selectedCountry) => setLocation(selectedCountry)
                        }/>
                    </FormControl>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        {
        fields.map((field, index) => {
            return (<Box mt="4" mb="4" display="flex"
                key={
                    field.id
                }
                alignItems="flex-end">
                <FormControl>
                    <FormLabel htmlFor="website">Website</FormLabel>
                    <Input type="url" id="website" placeholder="Website" {...register(`vault.${index}.website`, {
                                                        required: "Website is required."
                                                    })}/>
                </FormControl>
                <FormControl ml="2">
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input id="username" placeholder="Username" {...register(`vault.${index}.username`, {
                                                        required: "Username is required."
                                                    })}/>
                </FormControl>
                <FormControl ml="2">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input type={
                            showPasswords
                                ? "text"
                                : "password"
                        }
                        id="password"
                        placeholder="Password"
                        {...register(`vault.${index}.password`, {
                                                                required: "Password is required."
                                                            })}/>
                </FormControl>
                <Button type="button" bg="red.500" color="white" fontSize="2xl" ml="2"
                    onClick={
                        () => remove(index)
                }>
                    <FaTimes/>
                </Button>
                <Button type="button" bg="green.500" color="white" fontSize="2xl" ml="2"
                    onClick={
                        () => {
                            setShowPasswordOptions(true);
                            setCurrentItemIndex(index);
                        }
                }>
                    <FaSync/>
                </Button>
            </Box>);
        })
    }
        <Button onClick={
                () => append({website: '', username: '', password: ''})
            }
            aria-label="Add new entry">
            Add
        </Button>
        <Button ml="8" type="submit">
            Save vault
        </Button>
        <Button ml="8"
            onClick={
                () => setShowPasswords(!showPasswords)
        }> {
            showPasswords
                ? "Hide Passwords"
                : "Show Passwords"
        } </Button>
    </FormWrapper>);
}
export default Vault;