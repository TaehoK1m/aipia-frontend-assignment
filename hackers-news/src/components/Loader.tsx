export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-24 text-slate-400">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <span className="mt-2 text-sm">{label}...</span>
    </div>
  );
}
