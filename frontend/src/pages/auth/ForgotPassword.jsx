import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { HiEnvelope, HiCheckCircle } from "react-icons/hi2";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await forgotPassword(email);
    if (result.success) {
      setIsSent(true);
    }

    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/[0.15] dark:bg-emerald-500/10 flex items-center justify-center mb-6">
          <HiCheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We&apos;ve sent a password reset link to <br />
          <span className="text-indigo-600 dark:text-indigo-400">{email}</span>
        </p>
        <Link
          to="/signin"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
        >
          ← Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Forgot password?</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-7">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={HiEnvelope}
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
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-800/60 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
