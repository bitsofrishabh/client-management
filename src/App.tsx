import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import WorkoutsPage from './pages/WorkoutsPage';
import ProductsPage from './pages/ProductsPage';
import RecipesPage from './pages/RecipesPage';
import LoginForm from './components/Auth/LoginForm';
import ClientManagement from './pages/admin/ClientManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster position="top-right" richColors />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route
                  path="admin/clients"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ClientManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;