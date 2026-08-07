import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { getJobCardDetails } from '@/services/jobCardService'
import { getDocTypeMeta } from '@/services/operationMetaService'

export default function QuotationPage() {
  const { id } = useParams()
  const location = useLocation()

  const [jobCard, setJobCard] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobCardData =
          await getJobCardDetails(id)

        setJobCard(jobCardData)

        const quotationMeta =
          await getDocTypeMeta(
            'Quotation'
          )

        console.log(
          '========== QUOTATION META =========='
        )

        console.table(
          quotationMeta.fields.map(
            (field) => ({
              label: field.label,
              fieldname:
                field.fieldname,
              fieldtype:
                field.fieldtype,
              reqd: field.reqd,
              hidden:
                field.hidden,
              read_only:
                field.read_only,
              options:
                field.options,
            })
          )
        )

        console.log(
          'FULL QUOTATION META',
          quotationMeta
        )
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [id])

  const params =
    new URLSearchParams(
      location.search
    )

  const selectedContainers =
    JSON.parse(
      params.get('containers') ||
        '[]'
    )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Create Quotation
      </h1>

      <div className="mt-4">
        <strong>
          Job Card:
        </strong>{' '}
        {jobCard?.name}
      </div>

      <div>
        <strong>
          Customer:
        </strong>{' '}
        {jobCard?.customer}
      </div>

      <div className="mt-4">
        <strong>
          Selected Containers:
        </strong>

        <pre>
          {JSON.stringify(
            selectedContainers,
            null,
            2
          )}
        </pre>
      </div>

      <div className="mt-6 rounded-lg border p-4 bg-slate-50">
        Quotation fields are
        currently being printed
        to console for analysis.
      </div>
    </div>
  )
}