/* src/core/components/ui/Input.tsx */
type InputProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-gray-500 block mb-2">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
      />
    </div>
  )
}