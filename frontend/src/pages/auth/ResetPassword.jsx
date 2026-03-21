import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { HiLockClosed, HiXMark } from "react-icons/hi2";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, newPassword);
    if (result.success) {
      navigate("/signin");
    }
    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invalid Link</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link
          to="/forgot-password"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reset password</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-7">Enter your new password below</p>

      {error && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.10] dark:bg-rose-500/[0.07] border border-rose-500/30 dark:border-rose-500/20 animate-fade-in">
          <HiXMark className="h-5 w-5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
          <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
          icon={HiLockClosed}
          required
        />

        <InputField
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
          icon={HiLockClosed}
          success={confirmPassword && newPassword === confirmPassword}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-indigo-600 to-indigo-500
            hover:from-indigo-500 hover:to-indigo-400
            active:scale-[0.98]
            focus:ring-2 focus:ring-indigo-500/40 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-200 shadow-lg shadow-indigo-500/20
            flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-800/60 text-center">
        <Link
          to="/signin"
          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
