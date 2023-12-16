import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction, useState } from "react";
import FormWrapper from "./FormWrapper";

type PasswordVisibility = {
  password: boolean;
  confirmPassword: boolean;
};

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
  } = useForm<{
    email: string;
    password: string;
    confirmPassword: string;
    hashedPassword: string;
  }>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const mutation = useMutation(registerUser, {
    onSuccess: async ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const actualSalt = await salt;
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt: actualSalt,
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

  const handleLoginClick = () => {
    setStep("login");
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit(() => {
        const email = getValues("email");
        const password = getValues("password");
        const confirmPassword = getValues("confirmPassword");

        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }

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

        <Flex align="center">
          <Input
            id="password"
            placeholder="Password"
            type={isPasswordVisible.password ? "text" : "password"}
            {...register("password", {
              required: "Password is required.",
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
            onClick={() => togglePasswordVisibility("password")}
          >
            {isPasswordVisible.password ? <FiEyeOff /> : <FiEye />}
          </Button>
        </Flex>

        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mt="4">
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        
        <Flex align="center">
          <Input
            id="confirmPassword"
            placeholder="Confirm Password"
            type={isPasswordVisible.confirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password.",
            })}
          />

          <Button
            size="sm"
            ml="2"
            variant="ghost"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {isPasswordVisible.confirmPassword ? <FiEyeOff /> : <FiEye />}
          </Button>
        </Flex>
        
        <FormErrorMessage>
          {errors.confirmPassword && errors.confirmPassword.message}
        </FormErrorMessage>
      </FormControl>

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}

      <Button mt="4" type="submit" isLoading={mutation.isLoading}>
        Register
      </Button>

      <div style={{ marginTop: "20px" }}>
        {/* Login button with styling */}
        <Button variant="outline" onClick={handleLoginClick}>
          Login
        </Button>
      </div>
    </FormWrapper>
  );
}

export default RegisterForm;
