import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import Vault from '../components/Vault';

export interface VaultItem {
  website: string,
  username: string,
  password: string,
}

function Home() {

  const [step, setStep] = useState<'login' | 'register' | 'vault'>('login');
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");

  useEffect(() => {
    const vault = window.sessionStorage.getItem('vault');
    const vaultKey = window.sessionStorage.getItem('vk');

    if(vault) {
      setVault(JSON.parse(vault));
    }

    if(vaultKey) {
      setVaultKey(vaultKey)
      setStep("vault")
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by next app" />
        <link rel="icon" href="/favicone.ico" />
      </Head>

      <main className={styles.main}>
        {step === "register" && (
          <RegisterForm setStep={setStep} setVaultKey={setVaultKey} />
        )}
        {step === "login" && <LoginForm />}
        {step === "vault" && <Vault vault={vault} vaultKey={vaultKey} />}
      </main>
    </div>
  )
}

export default Home;