import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginModal = memo(({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const modalRef = useRef(null);
  const usernameInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setError("");
    } else if (usernameInputRef.current) {
      setTimeout(() => usernameInputRef.current.focus(), 50);
    }
  }, [isOpen]);

  const handleLogin = useCallback(() => {
    if (username === "admin" && password === "password123") {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      onClose();
      navigate("/admin");
    } else {
      setError("Incorrect username or password");
    }
  }, [username, password, onClose, navigate]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleLogin();
    },
    [handleLogin]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200]"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full p-1"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2
          id="admin-login-title"
          className="text-2xl font-bold text-white mb-4"
        >
          Admin Login
        </h2>

        {error && (
          <div
            className="text-red-500 mb-4 bg-red-900/20 p-2 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="text-left">
            <label
              htmlFor="username"
              className="block text-gray-300 mb-1 text-sm"
            >
              Username
            </label>
            <input
              ref={usernameInputRef}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              autoComplete="username"
              required
            />
          </div>
          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-gray-300 mb-1 text-sm"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 rounded-md font-bold hover:from-orange-500 hover:to-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
});

AdminLoginModal.displayName = "AdminLoginModal";

export default AdminLoginModal;
