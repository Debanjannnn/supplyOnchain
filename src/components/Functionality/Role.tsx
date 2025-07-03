"use client"
import React, { useState } from 'react'
import axios from "axios"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../WalletSelector";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface Roletype {
    name: string;
    pubKey: string;
    role: string;
}

const ROLE_OPTIONS = [
  { label: "Manufacturer", value: "MANUFACTURER" },
  { label: "Supplier", value: "SUPPLIER" },
  { label: "Distributor", value: "DISTRIBUTOR" },
  { label: "Retailer", value: "RETAILER" },
];

export default function Role() {
    const [name, setName] = useState("");
    const [pubKey, setPubKey] = useState("");
    const [role, setRole] = useState("");
    const { account, connected } = useWallet();
    const [existingUser, setExistingUser] = useState<(Roletype & { createdAt: string }) | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (connected && account?.address) {
            const address = account.address.toStringLong();
            setPubKey(address);
            setLoading(true);
            setError("");
            axios.get(`/api/role?pubKey=${address}`)
                .then(res => {
                    if (res.data && res.data.participant) {
                        setExistingUser(res.data.participant);
                    } else {
                        setExistingUser(null);
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        setExistingUser(null);
                    } else {
                        setError("Failed to check user existence");
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setPubKey("");
            setExistingUser(null);
        }
    }, [connected, account]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post("/api/role", { name, pubKey, role });
        console.log({ name, pubKey, role });
    };

    if (loading) {
        return (
            <Card className="max-w-md mx-auto mt-8 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Checking user...</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    if (existingUser) {
        return (
            <Card className="max-w-md mx-auto mt-8 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Participant Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div><b>Name:</b> {existingUser.name}</div>
                        <div><b>Role:</b> {existingUser.role}</div>
                        <div><b>Wallet Address:</b> {existingUser.pubKey}</div>
                        <div><b>Registered At:</b> {new Date(existingUser.createdAt).toLocaleString()}</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Register as a Participant</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <WalletSelector />
                    {!connected && <div className="text-red-500 text-center">Please connect your wallet to continue.</div>}
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                        disabled={!connected}
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                        disabled={!connected}
                    >
                        <option value="" disabled>Select Role</option>
                        {ROLE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Wallet Address"
                        value={pubKey}
                        disabled
                        className="border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <Button type="submit" disabled={!connected || !name || !role} className="mt-2">Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}

