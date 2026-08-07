// components/common/AlertDialog.jsx

import {
  AlertTriangle,
  X,
} from 'lucide-react'
import Button from './Button'

export default function AlertDialog({
  open,
  title = 'Alert',
  message,
  onClose,
}) {
  if (!open) return null

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
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

            <h3 className="font-semibold text-slate-900">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-1
              text-slate-500
              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-sm text-slate-600">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className="
            flex
            justify-end
            border-t
            border-slate-200
            px-5
            py-4
          "
        >
          <Button
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}