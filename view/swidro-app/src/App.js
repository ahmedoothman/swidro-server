// react
import React, { Suspense } from 'react';
// router
import { Routes, Route } from 'react-router-dom';
// components
// Auth Pages
const AuthPages = React.lazy(() => import('./pages/AuthPages'));
import { SignUp } from './pages/AuthPages/SignUp';
import { SignIn } from './pages/AuthPages/SignIn';
import { ForgetPassword } from './pages/AuthPages/ForgetPassword';
import { ResetPassword } from './pages/AuthPages/ResetPassword';
import { VerifyEmail } from './pages/AuthPages/VerifyEmail';
// Dashboard Pages
// styles
import './App.module.scss';

function App() {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/*" element={<AuthPages />}>
                        <Route path="sign-up" element={<SignUp />} />
                        <Route path="sign-in" element={<SignIn />} />
                        <Route
                            path="forget-password"
                            element={<ForgetPassword />}
                        />
                        <Route
                            path="reset-password/:token"
                            element={<ResetPassword />}
                        />
                        <Route
                            path="verify-email/:token"
                            element={<VerifyEmail />}
                        />
                    </Route>
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
