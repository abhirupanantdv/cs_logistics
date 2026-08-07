import { useEffect, useState } from 'react'
import api from '@/config/api'
import {
  underlineInputClass,
} from '@/components/common/formClasses'

export default function LinkField({
  field,
  value,
  onChange,
}) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get(
          `/resource/${field.options}`,
          {
            params: {
              fields: JSON.stringify(['name']),
              limit_page_length: 100,
              order_by: 'name asc',
            },
          }
        )

        const list = res.data?.data || []
        setOptions(list.map((i) => i.name))
      } catch (err) {
        console.error(err)
      }
    }

    if (field.options) fetchOptions()
  }, [field.options])

  return (
  <select
    value={value}
    onChange={(e) =>
      onChange(field.fieldname, e.target.value)
    }
    className={underlineInputClass}
    required={field.reqd === 1}
  >
    <option value="">
      Select {field.label}
    </option>

    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
)
}
