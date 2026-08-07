//Pagination.jsx
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="
          h-8 px-3 rounded-lg border
          bg-white text-xs
          disabled:opacity-40
          hover:bg-slate-50
        "
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            h-8 w-8 rounded-lg border text-xs font-medium
            ${
              currentPage === page
                ? 'bg-[#006B82] text-white border-[#006B82]'
                : 'bg-white hover:bg-slate-50'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="
          h-8 px-3 rounded-lg border
          bg-white text-xs
          disabled:opacity-40
          hover:bg-slate-50
        "
      >
        Next
      </button>
    </div>
  )
}