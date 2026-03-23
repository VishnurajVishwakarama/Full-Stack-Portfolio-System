import React from 'react';

export const Badge = ({ children, variant, dot, className }: any) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase transition-colors ${className} ${
      variant === 'cyan' ? 'bg-blue-500/10 text-blue-700 border border-blue-200 dark:border-transparent dark:bg-[#00f0ff]/10 dark:text-[#00f0ff]' : 
      variant === 'lime' ? 'bg-green-500/10 text-green-700 border border-green-200 dark:border-transparent dark:bg-[#7fff6e]/10 dark:text-[#7fff6e]' : 
      variant === 'gold' ? 'bg-amber-500/10 text-amber-700 border border-amber-200 dark:border-transparent dark:bg-[#f5c842]/10 dark:text-[#f5c842]' : 
      'bg-ink-100 text-ink-800 border border-ink-200 dark:border-transparent dark:bg-white/10 dark:text-white'
    }`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />}
      {children}
    </span>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, any>(({ children, className, variant, size, loading, ...props }, ref) => {
  const baseStyled = "inline-flex items-center justify-center rounded-md font-mono text-xs uppercase tracking-widest focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm active:scale-95";
  
  let variants = "bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-gray-200";
  if (variant === 'ghost') variants = "bg-transparent text-ink-800 border border-ink-200 hover:bg-ink-50 dark:text-white dark:border-white/20 dark:hover:bg-white/10 shadow-none";
  if (variant === 'gold') variants = "bg-amber-400 text-ink-950 hover:bg-amber-500 dark:bg-[#f5c842] dark:hover:bg-[#e0b530]";
  
  let sizes = "h-10 px-4 py-2";
  if (size === 'lg') sizes = "h-12 px-8 py-2";
  
  return (
    <button ref={ref} className={`${baseStyled} ${variants} ${sizes} ${className}`} disabled={loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
});
Button.displayName = "Button";

export const Modal = ({ children, open, onClose, title, size }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/20 dark:bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className={`bg-white dark:bg-ink-900 border border-ink-100 dark:border-white/10 rounded-lg shadow-xl p-6 w-full ${size === 'lg' ? 'max-w-4xl' : 'max-w-md'} animate-in fade-in zoom-in-95 duration-200`}>
        <div className="flex justify-between items-center mb-6 border-b border-ink-100 dark:border-white/10 pb-4">
          <h2 className="text-lg font-bold font-mono tracking-widest text-ink-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-900 dark:text-white/50 dark:hover:text-white transition-colors">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Input = React.forwardRef<HTMLInputElement, any>(({ label, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] font-mono text-ink-500 dark:text-ink-400 uppercase tracking-widest">{label}</label>}
      <input ref={ref} className={`flex h-11 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-600 dark:focus:border-[#00f0ff] dark:focus:ring-[#00f0ff] transition-all shadow-sm ${className}`} {...props} />
    </div>
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(({ label, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] font-mono text-ink-500 dark:text-ink-400 uppercase tracking-widest">{label}</label>}
      <textarea ref={ref} className={`flex min-h-[120px] w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-600 dark:focus:border-[#00f0ff] dark:focus:ring-[#00f0ff] transition-all shadow-sm ${className}`} {...props} />
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Spinner = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-500 dark:text-[#00f0ff]">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
