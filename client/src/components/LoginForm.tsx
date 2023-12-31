import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Flex,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { decryptVault, generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { loginUser } from "../api";
import { Dispatch, SetStateAction, useState } from "react";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";

type PasswordVisibility = {
  password: boolean;
};

function LoginForm({
  setVault,
  setVaultKey,
  setStep,
}: {
  setVault: Dispatch<SetStateAction<VaultItem[]>>;
  setVaultKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>;
}) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<{ email: string; password: string; hashedPassword: string }>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<PasswordVisibility>({
    password: false,
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      password: !prev.password,
    }));
  };

  const mutation = useMutation(loginUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt,
      });

      window.sessionStorage.setItem("vk", vaultKey);

      const decryptedVault = decryptVault({ vault, vaultKey });

      setVaultKey(vaultKey);
      setVault(decryptedVault);

      window.sessionStorage.setItem("vault", JSON.stringify(decryptedVault));

      setStep("vault");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";
      setErrorMessage(errorMessage);
    },
  });

  const handleRegistrationClick = () => {
    setStep("register");
  };

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
      <Heading>Login</Heading>
      <FormControl mt="4">
        <FormLabel htmlFor="email">Email</FormLabel>

        <Input
          id="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            minLength: { value: 4, message: "Email must be 4 characters long" },
          })}
        />

        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mt="4">
        <FormLabel htmlFor="password">Password</FormLabel>
        <Flex align="center">
          <Input
            id="password"
            placeholder="Password"
            type={isPasswordVisible.password ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be 6 characters long",
              },
            })}
          />
          <Button
            size="sm"
            ml="2"
            variant="ghost"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible.password ? <FiEyeOff /> : <FiEye />}
          </Button>
        </Flex>
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}

      <Button mt="4" type="submit" isLoading={mutation.isLoading}>
        Login
      </Button>

      <div style={{ marginTop: "20px" }}>
        {/* Registration button with styling */}
        <Button variant="outline" onClick={handleRegistrationClick}>
          Register
        </Button>
      </div>
    </FormWrapper>
  );
}

export default LoginForm;
