import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

function Vault({
    vault = [],
    vaultKey = ""
}: {
    vault: VaultItem[];
    vaultKey: string;
}) {
    const {control, register, handleSubmit} = useForm();

    const {fields, append, remove} = useFieldArray({
        control,
        name: "vault",
    });

    return (
        <FormWrapper>
            {fields.map((field, index) => {
                return <Box mt="4" mb="4" display="flex" key={field.id} alignItems="flex-end">
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
                            type="password"
                            id="password"
                            placeholder="Password"
                            {...register(`vault.${index}.password`, {
                                required: "Password is required."
                            })}
                        />
                    </FormControl>

                    <Button type="button" bg="red.500" color="white" fontSize="2xl" ml="2" onClick={() => remove(index)}>
                        -
                    </Button>
                </Box>
            })}

            <Button onClick={() => append({website: '', username: '', password: ''})}>
                Add
            </Button>
        </FormWrapper>
    )
}

export default Vault;