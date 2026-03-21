import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { HiUser, HiLockClosed, HiEnvelope, HiCheck, HiXMark } from "react-icons/hi2";

function PasswordStrength({ password }) {
  const checks = useMemo(() => [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ], [password]);

  const strength = checks.filter((c) => c.met).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-rose-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"][strength];

  if (!password) return null;

  return (
    <div className="space-y-2.5 pt-1 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= strength ? strengthColor : "bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${
          strength <= 1 ? "text-rose-500 dark:text-rose-400" : strength === 2 ? "text-amber-500 dark:text-amber-400" : strength === 3 ? "text-indigo-500 dark:text-indigo-400" : "text-emerald-500 dark:text-emerald-400"
        }`}>
          {strengthLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            {check.met ? (
              <HiCheck className="h-3 w-3 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <HiXMark className="h-3 w-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            )}
            <span className={`text-[11px] ${check.met ? "text-emerald-600 dark:text-emerald-400/80" : "text-slate-500 dark:text-slate-500"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
      case "username":
        if (!value) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 50) return "Username must be less than 50 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Only letters, numbers, and underscores";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError("");

    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    // If password changes, re-validate confirmPassword
    if (field === "password" && touched.confirmPassword && formData.confirmPassword) {
      const confirmError = value !== formData.confirmPassword ? "Passwords do not match" : "";
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const fields = ["username", "email", "password", "confirmPassword"];
    const newErrors = {};
    const newTouched = {};
    fields.forEach((f) => {
      newTouched[f] = true;
      newErrors[f] = validateField(f, formData[f]);
    });
    setTouched(newTouched);
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    setServerError("");
    const result = await signup(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    );
    if (result.success) {
      navigate("/signin");
    } else {
      setServerError(result.message || "Signup failed");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create account</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-7">Join Inventra to manage your inventory</p>

      {serverError && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.10] dark:bg-rose-500/[0.07] border border-rose-500/30 dark:border-rose-500/20 animate-fade-in">
          <HiXMark className="h-5 w-5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
          <p className="text-sm text-rose-700 dark:text-rose-300">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <InputField
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange("username")}
          onBlur={handleBlur("username")}
          icon={HiUser}
          error={touched.username ? errors.username : ""}
          hint="Letters, numbers, underscores"
          required
        />

        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          icon={HiEnvelope}
          error={touched.email ? errors.email : ""}
          required
        />

        <div>
          <InputField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange("password")}
            onBlur={handleBlur("password")}
            icon={HiLockClosed}
            error={touched.password ? errors.password : ""}
            required
          />
          <PasswordStrength password={formData.password} />
        </div>

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          icon={HiLockClosed}
          error={touched.confirmPassword ? errors.confirmPassword : ""}
          success={touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
          <div className="flex gap-3">
            {[
              { value: "EMPLOYEE", label: "Employee", desc: "Standard access" },
              { value: "ADMIN", label: "Admin", desc: "Full access" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: opt.value }))}
                className={`flex-1 p-3 rounded-xl border text-left transition-all duration-200 ${
                  formData.role === opt.value
                    ? "border-indigo-500/40 bg-indigo-500/[0.10] dark:bg-indigo-500/[0.06] ring-1 ring-indigo-500/20"
                    : "border-slate-300 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <span className={`text-sm font-medium ${
                  formData.role === opt.value ? "text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"
                }`}>
                  {opt.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
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
            flex items-center justify-center gap-2 mt-1"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-800/60 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
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
