// operationMetaService.js

import api from '@/config/api'

export const getDocTypeMeta = async (
  doctype
) => {

  
  try {
    console.log(
      'Fetching Meta For Doctype:',
      doctype
    )

    const response = await api.get(
      '/method/frappe.desk.form.load.getdoctype',
      {
        params: {
          doctype,
        },
      }
    )

    console.log(
      'Raw Meta Response:',
      response.data
    )

    console.log(
      'Fields:',
      response.data.docs?.[0]?.fields
    )

const meta =
  response.data.docs?.[0]

console.table(
  meta?.fields
    ?.filter(
      (field) =>
        field.reqd === 1 ||
        field.mandatory_depends_on
    )
    ?.map((field) => ({
      fieldname: field.fieldname,
      label: field.label,
      reqd: field.reqd,
      mandatory_depends_on:
        field.mandatory_depends_on,
    }))
)

    return response.data.docs?.[0]
  } catch (error) {
    console.error(
      'Meta Fetch Error:',
      error.response?.data || error
    )
    throw error
  }
}

export const getChildTableMeta =
  async (childDoctype) => {
    const response = await api.get(
      '/method/frappe.desk.form.load.getdoctype',
      {
        params: {
          doctype: childDoctype,
        },
      }
    )

    return response.data.docs?.[0]
  }
