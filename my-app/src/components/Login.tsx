import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Only validate if there's input
        if (newEmail) {
            setIsValidEmail(validateEmail(newEmail));
        } else {
            setIsValidEmail(true); // Reset validation state if empty
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate both fields are present
        if (!email || !password) {
            setError("Both fields are required!");
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            setError("Please enter a valid email address!");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }

        console.log("Logging in with:", email, password);
        setError(""); // Clear errors on success

        // Call the navigation function passed from parent component
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
                        Login
                    </h2>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm text-gray-600 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder="Enter your email"
                            className={`w-full px-3 py-2 border-b ${!isValidEmail ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
                        />
                        {!isValidEmail && email && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="password"
                            className="block text-sm text-gray-600 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="******************"
                            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center mt-2">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;