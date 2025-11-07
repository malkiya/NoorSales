import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Expenses from './pages/Expenses';
import LoginPage from './pages/LoginPage';
import type { Product, Customer, Invoice, Expense, Settings as AppSettings, User } from './types';
import { AppContext } from './AppContext';
import { LanguageProvider } from './LanguageContext';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        companyName: 'برنامج نور لإدارة المبيعات',
        currency: 'BHD',
        logo: null,
        companyPhone: '',
        companyEmail: '',
        instagramAccount: '',
        instagramQR: null,
        bankAccountBalance: 0,
    });
    const [showSidebar, setShowSidebar] = useState<boolean>(true);

    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        
        const savedCustomers = localStorage.getItem('customers');
        if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

        const savedInvoices = localStorage.getItem('invoices');
        if (savedInvoices) {
            const parsedInvoices: Invoice[] = JSON.parse(savedInvoices);
            const invoicesWithDefaults = parsedInvoices.map(inv => ({
                ...inv,
                status: inv.status || 'unpaid',
                returns: inv.returns || []
            }));
            setInvoices(invoicesWithDefaults);
        }

        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        } else {
            // Create a default admin if no users exist
            const defaultAdmin: User = {
                id: 'default-admin-01',
                name: 'المدير',
                username: 'admin',
                email: 'admin@system.com',
                password: 'admin',
                role: 'admin',
            };
            setUsers([defaultAdmin]);
        }
        
        const savedCurrentUser = sessionStorage.getItem('currentUser');
        if (savedCurrentUser) {
            setCurrentUser(JSON.parse(savedCurrentUser));
        }

        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            if (parsedSettings.currency === 'دينار بحريني') {
                parsedSettings.currency = 'BHD';
            }
            setSettings(prevSettings => ({...prevSettings, ...parsedSettings}));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('customers', JSON.stringify(customers));
    }, [customers]);

    useEffect(() => {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }, [invoices]);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);
    
    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem('users', JSON.stringify(users));
        }
    }, [users]);
    
    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    const contextValue = useMemo(() => ({
        products, setProducts,
        customers, setCustomers,
        invoices, setInvoices,
        expenses, setExpenses,
        settings, setSettings,
        users, setUsers,
        currentUser, setCurrentUser
    }), [products, customers, invoices, expenses, settings, users, currentUser]);

    if (!currentUser) {
        return (
            <LanguageProvider>
                <AppContext.Provider value={contextValue}>
                    <LoginPage />
                </AppContext.Provider>
            </LanguageProvider>
        );
    }

    return (
        <LanguageProvider>
            <AppContext.Provider value={contextValue}>
                <HashRouter>
                    <div className="flex h-screen bg-gray-100 text-gray-800">
                        <div className={`${showSidebar ? 'block' : 'hidden'} md:block`}>
                            <SideBar onClose={() => setShowSidebar(false)} />
                        </div>
                        <main className="flex-1 p-8 overflow-y-auto">
                            {/* Mobile toggle for sidebar */}
                            <div className="md:hidden mb-4">
                                <button
                                    onClick={() => setShowSidebar(s => !s)}
                                    className="px-3 py-2 bg-teal-600 text-white rounded"
                                    aria-label="Toggle sidebar"
                                >
                                    ☰
                                </button>
                            </div>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/customers" element={<Customers />} />
                                <Route path="/invoices" element={<Invoices />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/reports" element={<Reports />} />
                                {currentUser.role === 'admin' && <Route path="/settings" element={<Settings />} />}
                            </Routes>
                        </main>
                    </div>
                </HashRouter>
            </AppContext.Provider>
        </LanguageProvider>
    );
};

export default App;