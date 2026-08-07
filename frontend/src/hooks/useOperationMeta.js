//useOperationMeta.js
import {
  useEffect,
  useState,
} from 'react'

import {
  getDocTypeMeta,
  getChildTableMeta,
} from '@/services/operationMetaService'

import { getDoctype } from '@/utils/getDoctype'

export default function useOperationMeta(
  operation
) {
  const [meta, setMeta] =
    useState(null)

  const [tableMeta, setTableMeta] =
    useState({})

  const [loadingMeta, setLoadingMeta] =
    useState(false)

  useEffect(() => {
    const fetchMeta =
      async () => {
        if (!operation) {
          setMeta(null)
          return
        }

        try {
          setLoadingMeta(true)

          const doctype =
            getDoctype(operation)

          if (!doctype) return

          const data =
            await getDocTypeMeta(
              doctype
            )

          setMeta(data)
        } catch (error) {
          console.error(
            'Failed to fetch operation metadata:',
            error
          )

          setMeta(null)
        } finally {
          setLoadingMeta(false)
        }
      }

    fetchMeta()
  }, [operation])

  useEffect(() => {
    const fetchTableMeta =
      async () => {
        if (!meta?.fields)
          return

        const tables =
          meta.fields.filter(
            (field) =>
              field.fieldtype ===
              'Table'
          )

        const results = {}

        for (const tableField of tables) {
          const childMeta =
            await getChildTableMeta(
              tableField.options
            )

          results[
            tableField.fieldname
          ] = childMeta
        }

        setTableMeta(results)
      }

    fetchTableMeta()
  }, [meta])

  return {
    meta,
    tableMeta,
    loadingMeta,
  }
}