import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { Header } from './components/Layout/Header';
import { MarketplacePage } from './components/Marketplace/MarketplacePage';
import { GovernancePage } from './components/Governance/GovernancePage';
import { StatisticsPage } from './components/Statistics/StatisticsPage';
import { DocumentationPage } from './components/Documentation/DocumentationPage';
import { WhitePaperPage } from './components/Documentation/WhitePaperPage';
import { HomePage } from './components/Home/HomePage';
import { MiningCommandCenter } from './components/Dashboard/MiningCommandCenter';
import { AboutPage } from './components/About/AboutPage';
import { FeedbackWidget } from './components/Feedback/FeedbackWidget';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { AuthPage } from './components/Auth/AuthPage';
import { ResetPassword } from './components/Auth/ResetPassword';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WalletProvider>
          <Router>
            <div className="min-h-screen bg-[#0D1117] text-white">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<MiningCommandCenter />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/governance" element={<GovernancePage />} />
                  <Route path="/stats" element={<StatisticsPage />} />
                  <Route path="/docs" element={<DocumentationPage />} />
                  <Route path="/whitepaper" element={<WhitePaperPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <FeedbackWidget />
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'bg-gray-900 text-white',
                  duration: 4000,
                  style: {
                    background: '#1A202C',
                    color: '#fff',
                    border: '1px solid #2D3748'
                  },
                }}
              />
            </div>
          </Router>
        </WalletProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}