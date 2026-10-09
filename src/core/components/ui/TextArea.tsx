/* src/core/components/ui/TextArea.tsx */
type TextAreaProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: TextAreaProps) {
  return (
    <div>
      {label && (
        <label className="text-xs font-medium text-gray-500 block mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{ minHeight: rows * 24 + 60 }}
        className="w-full p-4 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 leading-relaxed"
      />
    </div>
  )
}