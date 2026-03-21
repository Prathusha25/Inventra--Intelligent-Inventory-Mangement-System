export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-[2px]",
    md: "h-7 w-7 border-[2.5px]",
    lg: "h-10 w-10 border-[3px]",
    xl: "h-14 w-14 border-[3px]",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-indigo-400 border-t-transparent border-r-transparent`}
      />
    </div>
  );
}
