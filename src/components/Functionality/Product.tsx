'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
// import { WalletSelector } from '../WalletSelector';

const allowedCategories = ["FOOD", "ELECTRONICS", "MEDICINE", "FASHION", "OTHER"];

type ProductType = {
    id?: string | number;
    name: string;
    batchId: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    manufacturerKey: string;
    createdAt?: string;
};

const Product = () => {
    const { account } = useWallet();
    const accountAddress = account?.address ? String(account.address) : '';
    const [form, setForm] = useState({
        name: '',
        batchId: '',
        description: '',
        price: '',
        quantity: '',
        category: allowedCategories[0],
        manufacturerKey: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [products, setProducts] = useState<ProductType[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [batchIdQuery, setBatchIdQuery] = useState('');

    // Update manufacturerKey when account changes
    useEffect(() => {
        setForm((prev) => ({ ...prev, manufacturerKey: accountAddress }));
    }, [accountAddress]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    quantity: Number(form.quantity),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create product');
            setSuccess('Product created!');
            setForm({
                name: '',
                batchId: '',
                description: '',
                price: '',
                quantity: '',
                category: allowedCategories[0],
                manufacturerKey: accountAddress,
            });
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (batchId?: string) => {
        setFetchLoading(true);
        setFetchError('');
        try {
            const url = batchId ? `/api/product?batchId=${encodeURIComponent(batchId)}` : '/api/product';
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
            setProducts(data.products || []);
        } catch (err: unknown) {
            if (err instanceof Error) setFetchError(err.message);
            else setFetchError('Unknown error');
        } finally {
            setFetchLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>

            <div style={{ margin: '12px 0' }}>
                <strong>Connected Account:</strong> {accountAddress || <span style={{ color: 'red' }}>Not connected</span>}
            </div>
            <h2>Create Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>
                    Name:
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                    Batch ID:
                    <input name="batchId" value={form.batchId} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <input name="description" value={form.description} onChange={handleChange} required />
                </label>
                <label>
                    Price:
                    <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </label>
                <label>
                    Quantity:
                    <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
                </label>
                <label>
                    Category:
                    <select name="category" value={form.category} onChange={handleChange} required>
                        {allowedCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Manufacturer Key:
                    <input name="manufacturerKey" value={form.manufacturerKey} readOnly style={{ background: '#f0f0f0' }} required />
                </label>
                <button type="submit" disabled={loading || !accountAddress}>{loading ? 'Creating...' : 'Create Product'}</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>{success}</div>}
            </form>

            <hr style={{ margin: '24px 0' }} />

            <h2>Fetch Products</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                    placeholder="Batch ID (optional)"
                    value={batchIdQuery}
                    onChange={e => setBatchIdQuery(e.target.value)}
                />
                <button onClick={() => fetchProducts(batchIdQuery)} disabled={fetchLoading}>
                    {fetchLoading ? 'Fetching...' : 'Fetch Products'}
                </button>
            </div>
            {fetchError && <div style={{ color: 'red' }}>{fetchError}</div>}
            <ul>
                {products.filter((p) => p.manufacturerKey === accountAddress).map((p) => (
                    <li key={p.id ?? p.batchId} style={{ marginBottom: 8 }}>
                        <strong>{p.name}</strong> (Batch: {p.batchId})<br />
                        Category: {p.category}, Price: {p.price}, Qty: {p.quantity}<br />
                        Desc: {p.description}<br />
                        Manufacturer: {p.manufacturerKey}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Product;