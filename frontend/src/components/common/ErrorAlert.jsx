//ErrorAlert.jsx
import { AlertTriangle, X } from 'lucide-react'

export default function ErrorAlert({
  message,
  title = 'Operation Failed',
  onClose,
}) {
  if (!message) return null

  return (
    <div
      className="
        mb-6
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-red-200
        bg-red-50
        p-4
        shadow-sm
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-red-100
        "
      >
        <AlertTriangle
          size={18}
          className="text-red-600"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="
            text-sm
            font-semibold
            text-red-800
          "
        >
          {title}
        </div>

        <div
          className="
            mt-1
            text-sm
            leading-relaxed
            text-red-700
            break-words
          "
        >
          {message}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="
            rounded-md
            p-1
            text-red-500
            transition
            hover:bg-red-100
            hover:text-red-700
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}