import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { HiUser, HiLockClosed, HiExclamationTriangle } from "react-icons/hi2";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const result = await signin(username, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMsg(result.message || "Invalid username or password");
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-7">Sign in to your account to continue</p>

      {/* Inline error banner */}
      {errorMsg && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/[0.10] dark:bg-rose-500/[0.07] border border-rose-500/30 dark:border-rose-500/20 animate-fade-in">
          <HiExclamationTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{errorMsg}</p>
            <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-0.5">Please check your credentials and try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setErrorMsg(""); }}
          icon={HiUser}
          required
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
          icon={HiLockClosed}
          required
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0"
            />
            <span className="group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

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
            flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
