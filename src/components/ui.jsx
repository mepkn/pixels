// Small shared UI pieces.

export function ButtonGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="font-semibold text-slate-600 mr-1">{label}</span>}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          disabled={o.disabled}
          aria-pressed={value === o.value}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${
            value === o.value
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
