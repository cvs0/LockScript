/* eslint-disable react/jsx-no-undef */
import { FaSync, FaTimes } from "react-icons/fa";
import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { encryptVault } from "../crypto";
import { useMutation } from "react-query";
import { saveVault } from "../api";
import { useState } from "react";

function generateRandomPassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    const textarea = document.createElement("textarea");
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    return password;
}


function Vault({
    vault = [],
    vaultKey = ""
}: {
    vault: VaultItem[];
    vaultKey: string;
}) {
    const { control, register, handleSubmit, setValue } = useForm({
        defaultValues: {
            vault,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "vault",
    });

    const [showPasswords, setShowPasswords] = useState(false);

    const mutation = useMutation(saveVault);
    
    const handleRandomizePassword = (index: number) => {
        const newPassword = generateRandomPassword();
        setValue(`vault.${index}.password`, newPassword);
    };

    return (
        <FormWrapper onSubmit={handleSubmit(({ vault }) => {
            console.log({ vault });

            const encryptedVault = encryptVault({
                vault: JSON.stringify({ vault }),
                vaultKey,
            });

            window.sessionStorage.setItem('vault', JSON.stringify(vault));

            mutation.mutate({
                encryptedVault,
            });
        })}>
            {fields.map((field, index) => {
                return (
                    <Box mt="4" mb="4" display="flex" key={field.id} alignItems="flex-end">
                        <FormControl>
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <Input
                                type="url"
                                id="website"
                                placeholder="Website"
                                {...register(`vault.${index}.website`, {
                                    required: "Website is required."
                                })}
                            />
                        </FormControl>

                        <FormControl ml="2">
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                                id="username"
                                placeholder="Username"
                                {...register(`vault.${index}.username`, {
                                    required: "Username is required."
                                })}
                            />
                        </FormControl>

                        <FormControl ml="2">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                id="password"
                                placeholder="Password"
                                {...register(`vault.${index}.password`, {
                                    required: "Password is required."
                                })}
                            />
                        </FormControl>

                        <Button type="button" bg="red.500" color="white" fontSize="2xl" ml="2" onClick={() => remove(index)}>
                            <FaTimes />
                        </Button>

                        <Button type="button" bg="green.500" color="white" fontSize="2xl" ml="2" onClick={() => handleRandomizePassword(index)}>
                            <FaSync />
                        </Button>
                    </Box>
                );
            })}

            <Button
                onClick={() => append({ website: '', username: '', password: '' })}
                aria-label="Add new entry"
            >
                Add
            </Button>

            <Button
                ml="8"
                type="submit"
            >
                Save vault
            </Button>

            <Button ml="8" onClick={() => setShowPasswords(!showPasswords)}>
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </Button>
        </FormWrapper>
    );
}

export default Vault;