import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
  } from "@chakra-ui/react";
  import FormWrapper from "./FormWrapper";
  import { useForm } from "react-hook-form";
  import { generateVaultKey, hashPassword } from "../crypto";
  import { useMutation } from "react-query";
  import { registerUser } from "../api";
  import { Dispatch, SetStateAction, useState } from "react";
  import { VaultItem } from "../pages";
  
  function RegisterForm({
    setVaultKey,
    setStep,
  }: {
    setVaultKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>;
  }) {
    const {
      handleSubmit,
      register,
      getValues,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<{ email: string; password: string; hashedPassword: string }>();
  
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const mutation = useMutation(registerUser, {
      onSuccess: ({ salt, vault }) => {
        const hashedPassword = getValues("hashedPassword");
        const email = getValues("email");
        const vaultKey = generateVaultKey({
          hashedPassword,
          email,
          salt,
        });
  
        window.sessionStorage.setItem("vk", vaultKey);
  
        setVaultKey(vaultKey);
  
        window.sessionStorage.setItem("vault", "");
  
        setStep("vault");
      },
  
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again later.";
        setErrorMessage(errorMessage);
      },
    });
  
    return (
      <FormWrapper
        onSubmit={handleSubmit(() => {
          const email = getValues("email");
          const password = getValues("password");
          const hashedPassword = hashPassword(password);
  
          setValue("hashedPassword", hashedPassword);
  
          mutation.mutate({
            email,
            hashedPassword,
          });
        })}
      >
        <Heading>Register</Heading>
        <FormControl mt="4">
          <FormLabel htmlFor="email">Email</FormLabel>
  
          <Input
            id="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required.",
              minLength: { value: 4, message: "Email must be 4 characters long" },
            })}
          />
  
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
  
        <FormControl mt="4">
          <FormLabel htmlFor="password">Password</FormLabel>
  
          <Input
            id="password"
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be 4 characters long",
              },
            })}
          />
  
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
  
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
        )}
  
        <Button mt="4" type="submit" isLoading={mutation.isLoading}>
          Register
        </Button>
      </FormWrapper>
    );
  }
  
  export default RegisterForm;  