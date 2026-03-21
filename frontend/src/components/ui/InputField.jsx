import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center justify-between text-sm font-medium text-slate-300">
          <span>
            {label}
            {required && <span className="text-rose-400 ml-0.5">*</span>}
          </span>
          {hint && !error && (
            <span className="text-xs font-normal text-slate-500">{hint}</span>
          )}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
            <Icon
              className={`h-[18px] w-[18px] transition-colors duration-200 ${
                error
                  ? "text-rose-400"
                  : isFocused
                  ? "text-indigo-400"
                  : "text-slate-500"
              }`}
            />
          </div>
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          className={`w-full rounded-xl bg-slate-800/60 px-4 py-3 text-sm text-white
            placeholder-slate-500 transition-all duration-200 outline-none
            border ${Icon ? "pl-11" : ""} ${isPassword ? "pr-11" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${
              error
                ? "border-rose-500/40 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/15 bg-rose-500/[0.03]"
                : success
                ? "border-emerald-500/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15"
                : "border-slate-700/60 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? (
              <HiEyeOff className="h-[18px] w-[18px]" />
            ) : (
              <HiEye className="h-[18px] w-[18px]" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-400 animate-fade-in">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
