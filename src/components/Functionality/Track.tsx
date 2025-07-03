"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface ProductType {
  name: string;
  batchId: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  manufacturerKey: string;
  createdAt: string;
}

interface TrackType {
  id: string;
  batchId: string;
  step: string;
  location: string;
  holder: string;
  message: string;
  createdAt: string;
}

export default function Track() {
  const { account, connected } = useWallet();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tracks, setTracks] = useState<Record<string, TrackType[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductsAndTracks = async () => {
      if (!connected || !account?.address) {
        setProducts([]);
        setTracks({});
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        // Fetch all products
        const prodRes = await axios.get("/api/product");
        const allProducts: ProductType[] = prodRes.data.products || [];
        // Filter products by current wallet
        const myProducts = allProducts.filter(
          (p) => p.manufacturerKey === account.address.toStringLong()
        );
        setProducts(myProducts);
        // Fetch tracks for each product
        const tracksObj: Record<string, TrackType[]> = {};
        await Promise.all(
          myProducts.map(async (product) => {
            try {
              const trackRes = await axios.get(`/api/track?batchId=${product.batchId}`);
              tracksObj[product.batchId] = trackRes.data.tracks || [];
            } catch {
              tracksObj[product.batchId] = [];
            }
          })
        );
        setTracks(tracksObj);
      } catch (err: any) {
        setError("Failed to fetch products or tracks");
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndTracks();
  }, [connected, account]);

  if (!connected) {
    return <div className="text-center mt-8">Please connect your wallet to view your products and tracks.</div>;
  }
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }
  if (products.length === 0) {
    return <div className="text-center mt-8">No products found for your wallet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 flex flex-col gap-6">
      {products.map((product) => (
        <Card key={product.batchId} className="shadow-md">
          <CardHeader>
            <CardTitle>{product.name} (Batch: {product.batchId})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              <div><b>Description:</b> {product.description}</div>
              <div><b>Category:</b> {product.category}</div>
              <div><b>Price:</b> {product.price}</div>
              <div><b>Quantity:</b> {product.quantity}</div>
              <div><b>Created At:</b> {new Date(product.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-4">
              <b>Tracking History:</b>
              {tracks[product.batchId] && tracks[product.batchId].length > 0 ? (
                <ul className="list-disc ml-6 mt-2">
                  {tracks[product.batchId].map((track) => (
                    <li key={track.id} className="mb-1">
                      <div><b>Step:</b> {track.step}</div>
                      <div><b>Location:</b> {track.location}</div>
                      <div><b>Holder:</b> {track.holder}</div>
                      <div><b>Message:</b> {track.message}</div>
                      <div className="text-xs text-gray-400"><b>At:</b> {new Date(track.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 mt-2">No tracking history yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
