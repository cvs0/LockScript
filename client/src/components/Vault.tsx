import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";

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
                return <Box key={field.id}>
                    <FormControl>
                        <FormLabel>Website</FormLabel>
                        <Input
                            type="url"
                            id="website"
                            placeholder="Website"
                            {...register(`vault.${index}.website`, {
                                required: "Website is required."
                            })}
                        />
                    </FormControl>
                </Box>
            })}
        </FormWrapper>
    )
}

export default Vault;