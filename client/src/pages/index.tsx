import React, { useEffect, useState } from "react";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import Vault from "../components/Vault";
import { PAGE_DESCRIPTION, PAGE_TITLE } from "../contants";

export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

function Home() {
  const [step, setStep] = useState<"login" | "register" | "vault">("login");
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");

  useEffect(() => {
    const vault = window.sessionStorage.getItem("vault");
    const vaultKey = window.sessionStorage.getItem("vk");

    if (vault) {
      try {
        const parsedVault = JSON.parse(vault);
        setVault(parsedVault);
      } catch (error) {
        console.error("Error parsing vault data:", error);
      }
      
    }

    if (vaultKey) {
      setVaultKey(vaultKey);
      setStep("vault");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="icon" href="/client/src/public/favicone.ico" />
      </Head>

      <main className={styles.main}>
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
