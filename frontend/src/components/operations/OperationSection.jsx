// OperationSection.jsx

import {
  fieldSupportsFullWidth,
  getSectionIcon,
} from './operationHelpers'

export default function OperationSection({
  section,
  renderField,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Section Header */}

      <div
        className="
          flex
          items-center
          gap-2.5
          border-b
          border-slate-200
          bg-slate-50
          px-4
          py-3
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            text-sm
          "
        >
          {getSectionIcon(
            section.label
          )}
        </div>

        <div>
          <h3
            className="
              text-sm
              font-semibold
              text-slate-900
            "
          >
            {section.label ||
              'Information'}
          </h3>

        </div>
      </div>

      {/* Section Body */}

      <div className="p-4">
        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >
          {section.fields.map(
            (field) => {
              if (
                field.fieldtype ===
                  'Column Break' ||
                field.fieldtype ===
                  'Section Break'
              ) {
                return null
              }

              return (
                <div
                  key={
                    field.fieldname
                  }
                  className={
                    fieldSupportsFullWidth(
                      field.fieldtype
                    )
                      ? 'md:col-span-2'
                      : ''
                  }
                >
                  {renderField(
                    field
                  )}
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
