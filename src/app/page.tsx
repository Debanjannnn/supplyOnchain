"use client";

import { AccountInfo } from "@/components/AccountInfo";
import Role from "@/components/Functionality/Role";
import Track from "@/components/Functionality/Track";
import { Header } from "@/components/Header";
import { MessageBoard } from "@/components/MessageBoard";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TopBanner } from "@/components/TopBanner";
import { TransferAPT } from "@/components/TransferAPT";
import { WalletDetails } from "@/components/WalletDetails";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const { connected } = useWallet();
  

  return (
    <div>
      <Role />
      <Track />
    </div>  
  );
}

export default App;
