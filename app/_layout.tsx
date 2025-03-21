import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/context/authContext'
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const initializeDatabase = async (db) => {
    try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users (
            uid TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            phone TEXT,
            profession TEXT,
            gender TEXT,
            address TEXT,
            image TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS wallets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            amount REAL DEFAULT 0,     
            totalIncome REAL DEFAULT 0,
            totalExpenses REAL DEFAULT 0,
            image TEXT,                
            uid TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,       
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            description TEXT,          
            image TEXT,                  
            uid TEXT NOT NULL,
            walletId TEXT NOT NULL,
            FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE,
            FOREIGN KEY (walletId) REFERENCES wallets (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS budgets (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,       
            amount REAL NOT NULL,     
            spent REAL DEFAULT 0,    
            startDate DATE NOT NULL, 
            endDate DATE NOT NULL,   
            uid TEXT NOT NULL,       
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE
        );
        `)
        console.log('Database initialized!');
    } catch (error) {
        console.log('Error while initializing the database:', error);
    }
}

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='(modals)/profileModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/budgetModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/walletModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/transactionModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/reportModal'
                options={{ presentation: 'modal' }}
            />
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName='personal_finance.db' onInit={initializeDatabase}>
            <AuthProvider>
                <StackLayout />
            </AuthProvider>
        </SQLiteProvider>
    )
}
