import type { Dispatch, SetStateAction } from 'react';

export interface Product {
    id: string;
    name: string;
    code?: string;
    price: number;
    stock: number;
}

export interface Customer {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface InvoiceItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: number;
    customerId: string;
    customerName: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: 'paid' | 'unpaid';
    returns?: InvoiceItem[];
    createdBy?: string;
}

export interface Expense {
    id: string;
    date: string;
    itemName: string;
    quantity: number;
    pricePerItem: number;
    total: number;
}

export interface Settings {
    companyName: string;
    currency: string;
    logo: string | null;
    companyPhone?: string;
    companyEmail?: string;
    instagramAccount?: string;
    instagramQR?: string | null;
    bankAccountBalance: number;
}

export interface User {
    id: string;
    name: string;
    username: string;
    email?: string;
    password: string; // In a real app, this should be a hash
    role: 'admin' | 'employee';
    language?: 'ar' | 'en';
}


export interface AppContextType {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
    customers: Customer[];
    setCustomers: Dispatch<SetStateAction<Customer[]>>;
    invoices: Invoice[];
    setInvoices: Dispatch<SetStateAction<Invoice[]>>;
    expenses: Expense[];
    setExpenses: Dispatch<SetStateAction<Expense[]>>;
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
    users: User[];
    setUsers: Dispatch<SetStateAction<User[]>>;
    currentUser: User | null;
    setCurrentUser: Dispatch<SetStateAction<User | null>>;
}