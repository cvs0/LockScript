import React, { useEffect, useState } from "react";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import Vault from "../components/Vault";
import { PAGE_DESCRIPTION, PAGE_TITLE } from "../contants";

// Define the shape of a single item in the vault
export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

function Home() {
  // State variables to manage the current step, vault data, and vault key
  const [step, setStep] = useState<"login" | "register" | "vault">("login");
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");

  useEffect(() => {
    // Retrieve stored vault data and vault key from sessionStorage on component mount
    const vault = window.sessionStorage.getItem("vault");
    const vaultKey = window.sessionStorage.getItem("vk");

    // Parse and set the vault data if it exists
    if (vault) {
      try {
        const parsedVault = JSON.parse(vault);
        setVault(parsedVault);
      } catch (error) {
        // Handle parsing errors
        console.error("Error parsing vault data:", error);
      }
    }

    // Set the vault key and switch to the 'vault' step if the vault key exists
    if (vaultKey) {
      setVaultKey(vaultKey);
      setStep("vault");
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className={styles.container}>
      <Head>
        {/* Set page title, description, and favicon */}
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="icon" href="/client/src/public/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Render different components based on the current step */}
        {step === "register" && (
          <RegisterForm setStep={setStep} setVaultKey={setVaultKey} />
        )}
        {step === "login" && (
          <LoginForm
            setVault={setVault}
            setStep={setStep}
            setVaultKey={setVaultKey}
          />
        )}
        {step === "vault" && <Vault vault={vault} vaultKey={vaultKey} />}
      </main>
    </div>
  );
}

export default Home;