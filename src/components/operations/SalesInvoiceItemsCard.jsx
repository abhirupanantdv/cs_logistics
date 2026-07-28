//SalesInvoiceItemsCard.jsx
export default function SalesInvoiceItemsCard({
  items,
  onGetItems,
}) {
  const total =
    items?.reduce(
      (sum, row) =>
        sum +
        Number(row.amount || 0),
      0
    ) || 0

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
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
    bg-slate-50
    px-4
    py-3
  "
>
        <div>
         <h3 className="text-sm font-semibold text-slate-900">
  Sales Invoice Items
</h3>

<p className="text-xs text-slate-500">
  Generate billable services
</p>
        </div>

        <button
          type="button"
          onClick={onGetItems}
          className="
            rounded-lg
            bg-[#006B82]
            px-3
            py-2
            text-xs
            font-medium
            text-white
            hover:bg-[#005a6a]
          "
        >
          Get Items
        </button>
      </div>

      {!items?.length ? (
        <div className="p-10 text-center text-slate-500">
          No invoice items generated.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th
  className="
    px-4
    py-2.5
    text-center
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
  "
>
  Item
</th>

<th className="px-4 py-2 text-center">
  Days
</th>

<th className="px-4 py-2 text-right">
  Rate
</th>

<th className="px-4 py-2 text-right">
  Amount
</th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="
                        border-b
                        border-slate-100
                        hover:bg-slate-50
                      "
                    >
                     <td className="px-4 py-2.5 text-center text-[13px]">
  <div className="font-medium text-slate-900">
    {item.item_name}
  </div>

  {item.description && (
    <div className="mt-1 text-xs text-slate-500">
      {item.description}
    </div>
  )}
</td>

                     <td className="px-4 py-2.5 text-center text-[13px]">
  {item.qty}
</td>

                      <td className="px-4 py-2.5 text-center text-[13px]">
  PGK {Number(item.rate || 0).toFixed(2)}
</td>

                     <td className="px-4 py-2.5 text-center text-[13px] font-medium">
  PGK {Number(item.amount || 0).toFixed(2)}
</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div
  className="
    flex
    justify-end
    border-t
    border-slate-200
    bg-slate-50
    px-4
    py-3
  "
>
            <div className="w-72">
  <div
    className="
      flex
      justify-between
      border-t
      border-slate-200
      pt-2
      text-base
      font-semibold
    "
  >
    <span>Total</span>

    <span>
      PGK {total.toFixed(2)}
    </span>
  </div>
</div>
          </div>
        </>
      )}
    </div>
  )
}
