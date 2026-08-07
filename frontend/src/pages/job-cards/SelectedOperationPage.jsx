// // SelectedOperationPage.jsx
// import { useEffect, useMemo, useState } from 'react'
// import api from '@/config/api'
// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { ArrowLeft } from 'lucide-react'
// import { useRef } from 'react'
// import { operationStatusMap } from '../../config/operationStatusMap'
// import AppLayout from '@/components/layout/AppLayout'
// import {
//   getJobCardDetails,
//   createAndSubmitOperationDocument,
// } from '@/services/jobCardService'
// import { handleFetchFrom } from '../../utils/handleFetchFrom'
// import { getVisibleFields } from '../../utils/getVisibleFields'
// import { getContainerDetails } from '@/services/containerService'
// import { getAddress } from '@/services/addressService'
// import {
//   getDocTypeMeta,
//   getChildTableMeta,
// } from '@/services/operationMetaService'
// import AlertDialog from '../../components/common/AlertDialog'
// import { validateOperation } from '../../utils/operationValidation'
// import { SYSTEM_FIELDS, HIDDEN_FIELD_TYPES } from '../../constants/fieldConstants'
// import useOperationMeta from '../../hooks/useOperationMeta'
// import { operationDocTypeMap } from '@/services/operationDoctypeMap'
// import LinkField from '@/components/common/LinkField'
// import DamageAnnotation from '@/components/job-card/DamageAnnotation'
// import OperationSection from '../../components/operations/OperationSection'
// import OperationField from '../../components/operations/OperationField'
// import { buildSections, buildInitialFormData } from '../../components/operations/operationHelpers'
// import { quotationRules } from '../../operations/quotation/quotationRules'
// import {buildQuotationItems} from '../../operations/quotation/quotationItemBuilder'
// import {buildSalesInvoiceItems }from '../../operations/salesInvoice/salesInvoiceItemBuilder'
// import SalesInvoiceItemsCard from '../../components/operations/SalesInvoiceItemsCard'
// import ErrorAlert from '../../components/common/ErrorAlert'
// import { validateContainerStatusChange} from '../../utils/validateContainerStatus'
// import { getERPErrorMessage } from '../../utils/getERPErrorMessage'
// import { useAuth } from '../../hooks/useAuth'

// const jobCardFieldMap = {
//   'Gate In': 'job_card',
//   'Gate Out': 'job_card',
//   'Equipment Interchange Receipt': 'job_card',
//   Quotation: 'custom_job_card',
//   'Sales Invoice': 'custom_container_job_card',
//   'Pickup & Delivery Docket': 'job_card_number',
// }


// const fieldSupportsFullWidth = (fieldType) =>
//   ['Text', 'Small Text', 'Text Editor'].includes(fieldType)

// const getDoctype = (operation) => operationDocTypeMap[operation]

// const getCurrentTime = () =>
//   new Date().toLocaleTimeString('en-GB', {
//     hour12: false,
//   })

// export default function SelectedOperationPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { user } = useAuth()

//   const [jobCard, setJobCard] = useState(null)
//   const [selectedContainers, setSelectedContainers] = useState([])
//   const [containerDetails, setContainerDetails] = useState([])
//   const [operation, setOperation] = useState('')
//   // const [meta, setMeta] = useState(null)
//   const [formData, setFormData] = useState({})
//   const jobCardField = jobCardFieldMap[operation]
//   const [loading, setLoading] = useState(true)
//   const [submitState, setSubmitState] = useState({
//     loading: false,
//     error: null,
//     success: false,
//   })
//   const [error, setError] = useState('')
//   const [alertDialog, setAlertDialog] =
//   useState({
//     open: false,
//     title: '',
//     message: '',
//     type: 'error',
//   })

//   const [damageMarkers, setDamageMarkers] =
//   useState([])
//   const damageAnnotationApi = useRef(null)

//   const [confirmedDamageImage,
//   setConfirmedDamageImage] =
//   useState('')

// const showStorageStart =
//   operation === 'Gate In' &&
//   selectedContainers.some(
//     (container) =>
//       container.startsWith('CSL')
//   )


//   const handleGetItems = async () => {
//   console.log('GET ITEMS CLICKED')

//   const validation =
//     quotationRules.validateBeforeGetItems(
//       formData
//     )

//   console.log(
//     'VALIDATION RESULT',
//     validation
//   )

//   if (!validation.valid) {
//     alert(validation.message)
//     return
//   }

//   console.log(
//     'FORM DATA',
//     formData
//   )

//   console.log(
//     'CONTAINER DETAILS',
//     containerDetails
//   )

//   const items =
//     await buildQuotationItems({
//       formData,
//       containerDetails,
//     })

//   console.log(
//     'GENERATED ITEMS',
//     items
//   )

//   setFormData((prev) => ({
//     ...prev,
//     items,
//   }))
// }

//   useEffect(() => {
//     const params = new URLSearchParams(location.search)
//     const operationValue = params.get('operation')
//     const containersParam = params.get('containers')

//     setOperation(operationValue || '')

//     if (containersParam) {
//       try {
//         const parsedContainers = JSON.parse(containersParam)
//         if (Array.isArray(parsedContainers)) {
//           setSelectedContainers(parsedContainers)
//         }
//       } catch (error) {
//         console.error('Unable to load selected containers:', error)
//       }
//     }
//   }, [location.search])

//   useEffect(() => {
//     const fetchJobCard = async () => {
//       if (!id) return

//       try {
//         const data = await getJobCardDetails(id)
//         setJobCard(data)
//       } catch (error) {
//         console.error('Failed to load job card details:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchJobCard()
//   }, [id])

//   const {
//   meta,
//   tableMeta,
//   loadingMeta,
// } = useOperationMeta(
//   operation
// )

// useEffect(() => {
//   if (!containerDetails.length) {
//     return
//   }

//   if (operation === 'Quotation') {
//     setFormData(prev => ({
//       ...prev,
//       custom_container: containerDetails.map(container => ({
//         container: container.container_number,
//         container_owner: container.owner_name,
//         type: container.item,
//         status: container.status,
//       })),
//     }))
//   }

// }, [
//   operation,
//   containerDetails,
// ])

//   useEffect(() => {
//     const fetchSelectedContainerDetails = async () => {
//       if (!selectedContainers.length) {
//         setContainerDetails([])
//         return
//       }

//       try {
//         const details = await Promise.all(
//           selectedContainers.map((containerName) =>
//             getContainerDetails(containerName)
//           )
//         )
//         setContainerDetails(details)
//       } catch (error) {
//         console.error('Failed to fetch selected container details:', error)
//         setContainerDetails([])
//       }
//     }

//     fetchSelectedContainerDetails()
//   }, [selectedContainers])

// const evaluateExpression = (
//   expression,
//   formData
// ) => {
//   if (!expression) {
//     return true
//   }

//   if (
//     expression.startsWith('eval:')
//   ) {
//     try {
//       const fn = new Function(
//         'doc',
//         `return (${expression.replace(
//           'eval:',
//           ''
//         )})`
//       )

//       return !!fn(formData)
//     } catch (err) {
//       console.error(err)
//       return true
//     }
//   }

//   return true
// }

// const evaluateDependsOn = (
//   field,
//   formData
// ) => {
//   const dependsResult =
//     evaluateExpression(
//       field.depends_on,
//       formData
//     )

//   const mandatoryResult =
//     evaluateExpression(
//       field.mandatory_depends_on,
//       formData
//     )

//   return (
//     dependsResult &&
//     mandatoryResult
//   )
// }

// const visibleFields =
//   useMemo(
//     () =>
//       getVisibleFields({
//         meta,
//         operation,
//         formData,
//         showStorageStart,
//       }),
//     [
//       meta,
//       operation,
//       formData,
//       showStorageStart,
//     ]
//   )

// const sections = useMemo(
//   () => buildSections(visibleFields),
//   [visibleFields]
// )

// const initializedRef = useRef(false)

//   useEffect(() => {
//   if (!jobCard || !meta) return

//   if (initializedRef.current) return

//   initializedRef.current = true

//   const defaults =
//     buildInitialFormData({
//       visibleFields,
//       jobCard,
//       operation,
//       selectedContainers,
//       jobCardField,
//       currentUser: user,
//     })

// if (operation === 'Quotation') {
//   defaults.custom_container =
//     containerDetails.map(
//       (container) => ({
//         container:
//           container.container_number ||
//           container.name,

//         container_owner:
//           container.owner_name ||
//           jobCard.customer,

//         type:
//           container.item ||
//           container.container_type ||
//           '',

//         status:
//           container.status || '',
//       })
//     )
// } else if (operation === 'Sales Invoice') {
//   defaults.custom_container =
//     containerDetails.map(
//       (container) => ({
//         container:
//           container.container_number ||
//           container.name,

//         container_owner:
//           container.owner_name ||
//           jobCard.customer,

//         type:
//           container.item ||
//           container.container_type ||
//           '',

//         status:
//           container.status || '',
//       })
//     )
// }
//  else if (operation === 'Pickup & Delivery Docket') {
//   defaults.container =
//     containerDetails.map(
//       (container) => ({
//         container:
//           container.container_number ||
//           container.name,

//         container_owner:
//           container.owner_name ||
//           jobCard.customer,

//         type:
//           container.item ||
//           container.container_type ||
//           '',

//         status:
//           container.status || '',
//       })
//     )
// }


//   if (
//     operation === 'Sales Invoice' &&
//     visibleFields.some(
//       (field) =>
//         field.fieldname === 'posting_time'
//     )
//   ) {
//     defaults.posting_time =
//       getCurrentTime()
//   }

//   if (
//     operation === 'Sales Invoice' &&
//     visibleFields.some(
//       (field) =>
//         field.fieldname === 'set_posting_time'
//     )
//   ) {
//     defaults.set_posting_time = 0
//   }

//   setFormData((prev) => ({
//     ...defaults,
//     ...prev,
//   }))
// }, [
//   jobCard,
//   meta,
//   operation,
//   selectedContainers,
//   // visibleFields,
//   jobCardField,
//   user,
//   containerDetails,
// ])

// useEffect(() => {
//   initializedRef.current = false
// }, [operation])

// const handleFieldChange = async (
//   fieldname,
//   value
// ) => {
//   // ----------------------------
//   // Special Case: Docket Type
//   // ----------------------------
//   if (fieldname === 'docket_type') {
//     if (value === 'Pickup') {
//       setFormData(prev => ({
//         ...prev,
//         docket_type: value,
//         delivery_date_time: '',
//       }))
//     }

//     if (value === 'Delivery') {
//       setFormData(prev => ({
//         ...prev,
//         docket_type: value,
//         pickup_date_time: '',
//       }))
//     }

//     return
//   }

//   // ----------------------------
//   // Special Case: Posting Time
//   // ----------------------------
//   if (
//     operation === 'Sales Invoice' &&
//     fieldname === 'set_posting_time'
//   ) {
//     setFormData(prev => ({
//       ...prev,
//       set_posting_time: value,
//       posting_time:
//         value === 1 || value === true
//           ? prev.posting_time ||
//             getCurrentTime()
//           : getCurrentTime(),
//     }))

//     return
//   }

//   // ----------------------------
//   // Update Changed Field First
//   // ----------------------------
//   setFormData(prev => ({
//     ...prev,
//     [fieldname]: value,
//   }))

//   // ----------------------------
//   // Generic fetch_from Support
//   // ----------------------------
//   const changedField =
//     meta?.fields?.find(
//       f => f.fieldname === fieldname
//     )

//   const fetchTargets =
//     meta?.fields?.filter(
//       f =>
//         f.fetch_from?.startsWith(
//           `${fieldname}.`
//         )
//     ) || []

//   if (
//     changedField?.fieldtype === 'Link' &&
//     value &&
//     fetchTargets.length
//   ) {
//     try {
//       const linkedDoc =
//         await getDoc(
//           changedField.options,
//           value
//         )

//       const updates = {}

//       fetchTargets.forEach(
//         targetField => {
//           const sourceField =
//             targetField.fetch_from
//               .split('.')[1]

//           updates[
//             targetField.fieldname
//           ] =
//             linkedDoc?.[
//               sourceField
//             ] || ''
//         }
//       )

//       setFormData(prev => ({
//         ...prev,
//         ...updates,
//       }))
//     } catch (err) {
//       console.error(
//         'Fetch From Error:',
//         err
//       )
//     }
//   }

//   // ----------------------------
//   // Origin Address
//   // ----------------------------
//   if (
//     fieldname ===
//     'custom_choose_origin_address'
//   ) {
//     try {
//       const address =
//         await getAddress(value)

//       setFormData(prev => ({
//         ...prev,
//         custom_from_location:
//           address.address_line1 ||
//           address.address_title ||
//           '',
//       }))
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   // ----------------------------
//   // Destination Address
//   // ----------------------------
//   if (
//     fieldname ===
//     'custom_choose_destination_address'
//   ) {
//     try {
//       const address =
//         await getAddress(value)

//       setFormData(prev => ({
//         ...prev,
//         custom_to_location:
//           address.address_line1 ||
//           address.address_title ||
//           '',
//       }))
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   // ----------------------------
//   // Pickup Address
//   // ----------------------------
//   if (fieldname === 'from') {
//     try {
//       const address =
//         await getAddress(value)

//       setFormData(prev => ({
//         ...prev,
//         from_address:
//           address.address_line1 ||
//           address.address_title ||
//           '',
//       }))
//     } catch (err) {
//       console.error(
//         'Unable to fetch from address',
//         err
//       )
//     }
//   }

//   // ----------------------------
//   // Delivery Address
//   // ----------------------------
//   if (fieldname === 'to') {
//     try {
//       const address =
//         await getAddress(value)

//       setFormData(prev => ({
//         ...prev,
//         to_address:
//           address.address_line1 ||
//           address.address_title ||
//           '',
//       }))
//     } catch (err) {
//       console.error(
//         'Unable to fetch to address',
//         err
//       )
//     }
//   }
// }
//  const renderField = (field) => (
//   <OperationField
//     field={field}
//     value={formData[field.fieldname]}
//     formData={formData}
//     operation={operation}
//     jobCardField={jobCardField}
//     onChange={handleFieldChange}
//     tableMeta={tableMeta}
//   />
// )

// const containerTableField =
//   operation === 'Quotation' ||
//   operation === 'Sales Invoice'
//     ? 'custom_container'
//     : 'container'
// const handleGetSalesInvoiceItems =
//   async () => {
//     const items =
//       await buildSalesInvoiceItems({
//         jobCard,
//         formData,
//         containerDetails,
//       })

//     setFormData((prev) => ({
//       ...prev,
//       items,
//     }))
//   }
//   const getSubmissionData = () => {
//     const data = { ...formData }

//     if (
//       operation === 'Gate In' ||
//       operation === 'Gate Out'
//     ) {
//       data.container = selectedContainers.map(
//         (containerName) => ({
//           container: containerName,
//         })
//       )
//     }

//     if (operation === 'Quotation') {
//   const today = new Date()

//   const validTill = new Date()
//   validTill.setDate(
//     validTill.getDate() + 30
//   )

//   data.naming_series =
//     'SAL-QTN-.YYYY.-'

//   data.quotation_to =
//     'Customer'

//   data.party_name =
//     jobCard.customer

//   data.customer_name =
//     jobCard.customer

//   data.company =
//     'CS Logistics'

//   data.currency = 'PGK'

//   data.selling_price_list =
//     'Standard Selling'

//   data.price_list_currency =
//     'INR'

//   data.transaction_date =
//     today.toISOString().split('T')[0]

//   data.valid_till =
//     validTill
//       .toISOString()
//       .split('T')[0]

//   data.custom_job_card =
//     jobCard.name

//   // Build Container Child Table
//   data.custom_container =
//     containerDetails.map(
//       (container, index) => ({
//         container:
//           container.container_number ||
//           container.name,

//         container_owner:
//           container.owner_name ||
//           jobCard.customer,

//         type:
//           container.item ||
//           container.container_type ||
//           '',

//         status:
//           container.status || '',
//       })
//     )

//   // Build Items Table
//   data.items =
//   formData.items || []

//   // ERP Required Numeric Fields
//   ;[
//     'base_net_total',
//     'net_total',
//     'base_total',
//     'total',
//     'grand_total',
//     'base_grand_total',
//     'rounded_total',
//     'base_rounded_total',
//     'base_total_taxes_and_charges',
//     'total_taxes_and_charges',
//   ].forEach((field) => {
//     data[field] =
//       Number(data[field] || 0)
//   })
// }

// if (
//   operation ===
//   'Pickup & Delivery Docket'
// ) {
// data.naming_series =
//     data.docket_type === 'Delivery'
//       ? 'Delivery-'
//       : 'Pickup-'

//   data.container =
//     containerDetails.map(
//       (container, index) => ({
//         container:
//           container.container_number ||
//           container.name,

//         container_owner:
//           container.owner_name ||
//           jobCard.customer,

//         type:
//           container.item ||
//           container.container_type ||
//           '',

//         status:
//           container.status ||
//           'In Transit',
//       })
//     )
// }
// if (
//   operation ===
//   'Equipment Interchange Receipt'
// ) {
//   data.container =
//     selectedContainers.map(
//       (containerName) => ({
//         container:
//           containerName,
//       })
//     )

//   data.damage_annotation_image =
//     formData.damage_annotation_image
// }

// if (operation === 'Sales Invoice') {
//   data.customer = jobCard.customer

//   data.custom_container =
//   formData.custom_container || []

//   data.company = 'CS Logistics'

//   data.currency = 'PGK'

//   data.posting_date =
//     data.posting_date ||
//     new Date().toISOString().split('T')[0]

//   data.due_date =
//     data.due_date ||
//     new Date().toISOString().split('T')[0]

//   data.custom_container_job_card =
//     jobCard.name

//  data.items =
//   formData.items || []

//   data.base_net_total = 0
//   data.net_total = 0
//   data.base_total = 0
//   data.total = 0
//   data.grand_total = 0
//   data.base_grand_total = 0
//   data.rounded_total = 0
//   data.base_rounded_total = 0
// }

//     return data
//   }



// const uploadDamageImage = async () => {
//     console.log(
//   'damageAnnotationApi.current',
//   damageAnnotationApi.current
// )
//   if (!damageAnnotationApi.current){
//     console.error('DamageAnnotation ref missing')
//     return null
//   }

//   const base64 =
//   damageAnnotationApi.current.exportImage()

//   console.log('Base64 Generated:', !!base64)

//   if (!base64) {
//     console.error('No image generated')
//     return null
//   }

//   const blob = await (
//     await fetch(base64)
//   ).blob()

//   console.log('Blob Size:', blob.size)

//   const uploadFormData =
//   new FormData()

// uploadFormData.append(
//   'file',
//   blob,
//   `eir-damage-${Date.now()}.png`
// )

// uploadFormData.append(
//   'is_private',
//   0
// )

//   const response = await api.post(
//     '/method/upload_file',
//     uploadFormData,
//     {
//       headers: {
//         'Content-Type':
//           'multipart/form-data',
//       },
//     }
//   )

//   console.log(
//     'UPLOAD RESPONSE:',
//     response.data
//   )

//   return (
//     response.data?.message
//       ?.file_url || null
//   )
// }

// const handleConfirmDamageImage =
//   async () => {
//     try {
//       const uploadedFileUrl =
//         await uploadDamageImage()

//       console.log(
//         'Uploaded File URL:',
//         uploadedFileUrl
//       )

//       setConfirmedDamageImage(
//         uploadedFileUrl
//       )

//       setFormData((prev) => ({
//         ...prev,
//         damage_annotation_image:
//           uploadedFileUrl,
//       }))
//     } catch (error) {
//       console.error(
//         'Failed to upload damage image',
//         error
//       )
//     }
//   }

//   const validateMandatoryFields = () => {
//   if (!meta?.fields) {
//     return {
//       valid: true,
//     }
//   }

//   const missingFields = meta.fields.filter(
//     (field) => {
//       const isMandatory =
//         field.reqd === 1

//       const isVisibleOnApp =
//         field.show_on_app === 1

//       if (
//         !isMandatory ||
//         !isVisibleOnApp
//       ) {
//         return false
//       }

//       const value =
//         formData[field.fieldname]

//       if (
//         field.fieldtype === 'Check'
//       ) {
//         return false
//       }

//       return (
//         value === undefined ||
//         value === null ||
//         value === ''
//       )
//     }
//   )

//   return {
//     valid: missingFields.length === 0,
//     missingFields,
//   }
// }

//   const handleSubmit = async () => {
//   const validation =
//     validateOperation({
//       operation,
//       formData,
//       selectedContainers,
//       containerDetails,
//       showStorageStart,
//       operationStatusMap,
//       validateContainerStatusChange,
//     })

//   if (!validation.valid) {
//     setSubmitState({
//       loading: false,
//       error: validation.message,
//       success: false,
//     })

//     return
//   }

//   const doctype =
//     getDoctype(operation)

//   if (!doctype) {
//     setSubmitState({
//       loading: false,
//       error:
//         'Unable to determine document type.',
//       success: false,
//     })

//     return
//   }



// const mandatoryValidation =
//   validateMandatoryFields()

// if (!mandatoryValidation.valid) {
//   const fieldNames =
//     mandatoryValidation.missingFields
//       .map(
//         (field) =>
//           field.label ||
//           field.fieldname
//       )
//       .join(', ')

//   setAlertDialog({
//     open: true,
//     title: 'Required Fields Missing',
//     message: `Please fill the following required fields:\n${fieldNames}`,
//     type: 'error',
//   })

//   return
// }

//   setSubmitState({
//     loading: true,
//     error: null,
//     success: false,
//   })

//   try {
//     const payload =
//       getSubmissionData()

//     console.log(
//       `FINAL ${operation.toUpperCase()} PAYLOAD`,
//       JSON.stringify(
//         payload,
//         null,
//         2
//       )
//     )

//     const response =
//       await createAndSubmitOperationDocument(
//         doctype,
//         payload
//       )

//     console.log(
//       `Created ${operation}:`,
//       response
//     )

//     setSubmitState({
//       loading: false,
//       error: null,
//       success: true,
//     })

//     navigate(
//       `/job-cards/${encodeURIComponent(
//         id
//       )}`
//     )
//   } catch (error) {
//     console.error(
//       `Failed to create ${operation}:`,
//       error
//     )

//     setSubmitState({
//       loading: false,
//       error:
//         getERPErrorMessage(error),
//       success: false,
//     })
//   }
// }

//   return (
//     <AppLayout
//       title={`Create New ${operation || ''}`}
//       description={
//         jobCard?.name
//           ? `Create ${operation || 'operation'} for ${jobCard.name}`
//           : 'Review selected operation and containers'
//       }
//     >
//       <div className="max-w-[1300px] mx-auto space-y-4 pb-4">


//         <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
//             <div>
//               <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                 Job Card No.
//               </div>
//               <h1 className="mt-1 flex flex-wrap items-center gap-2 text-lg font-bold text-[#006B82]">
//                 <span>{loading ? 'Loading...' : jobCard?.name || 'N/A'}</span>
//                 <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
//                   {operation || 'Operation'}
//                 </span>
//               </h1>
//             </div>

//             <div className="lg:border-l lg:border-slate-100 lg:pl-4">
//               <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</div>
//               <h2 className="mt-1 truncate text-sm font-semibold text-slate-900">{jobCard?.customer || 'N/A'}</h2>
//               <div className="mt-1 truncate text-xs text-slate-500">{jobCard?.customer_contact || ''}</div>
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
//               <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                 Selected Containers ({selectedContainers.length})
//               </div>
//               {selectedContainers.length === 0 ? (
//                 <div className="p-4 text-xs text-slate-600">
//                   No containers selected. Please go back and choose at least one container.
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full">
//                     <thead className="bg-slate-50">
//                       <tr className="border-b border-slate-200">
//                         <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                           Container No.
//                         </th>

//                         <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                           Owner
//                         </th>

//                         <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                           Type
//                         </th>

//                         <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                           Size
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {selectedContainers.map((containerName) => {
//                         const container =
//                           containerDetails.find(
//                             (ct) =>
//                               ct.container_number === containerName ||
//                               ct.name === containerName
//                           ) || { container_number: containerName }

//                         return (
//                           <tr
//                             key={containerName}
//                             className="hover:bg-slate-50"
//                           >
//                             <td className="px-4 py-2.5 text-[13px] font-semibold text-slate-900">
//                               {container.container_number ||
//                                 containerName}
//                             </td>

//                             <td className="px-4 py-2.5 text-[13px] text-slate-600">
//                               {container.owner_name ||
//                                 jobCard?.customer ||
//                                 'N/A'}
//                             </td>

//                             <td className="px-4 py-2.5 text-[13px] text-slate-600">
//                               {container.item ||
//                                 container.container_type ||
//                                 'N/A'}
//                             </td>

//                             <td className="px-4 py-2.5 text-[13px] text-slate-600">
//                               {/* <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"> */}
//                                 {container.size || 'N/A'}
//                               {/* </span> */}
//                             </td>
//                           </tr>
//                         )
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {operation === 'Equipment Interchange Receipt' && (
//           <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4">
//   <h3 className="text-sm font-semibold text-slate-900">
//     Damage Annotation
//   </h3>
// </div>
//            <DamageAnnotation
//               onChange={setDamageMarkers}
//               onReady={(api) => {
//                 console.log(
//                   'ONREADY CALLED',
//                   api
//                 )

//                 damageAnnotationApi.current = api
//               }}
//             />
//             {damageMarkers?.length > 0 && (
//   <div className="mt-4 flex justify-end">
//     <button
//       type="button"
//       onClick={handleConfirmDamageImage}
//       className="
//         inline-flex
//         h-10
//         items-center
//         justify-center
//         rounded-lg
//         bg-[#006B82]
//         px-5
//         text-xs
//         font-semibold
//         text-white
//         transition
//         hover:bg-[#005a6a]
//       "
//     >
//       Confirm Damage Image
//     </button>
//   </div>
// )}


//                 {confirmedDamageImage && (
//                   <div
//                     className="
//                       mt-4
//                       rounded-lg
//                       border
//                       border-emerald-200
//                       bg-emerald-50
//                       p-4
//                     "
//                   >
//                     <div
//                       className="
//                         text-sm
//                         font-medium
//                         text-emerald-700
//                       "
//                     >
//                       Damage annotation image
//                       confirmed
//                     </div>

//                 <div className="mt-2">
//                       <img
//                         src={confirmedDamageImage}
//                         alt="Damage Annotation"
//                         className="
//                           max-h-48
//                           rounded-lg
//                           border
//                         "
//                       />
//                     </div>
//                   </div>
//                 )}
//                           </div>
//                         )}



//         <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
//             <h3 className="text-sm font-semibold text-slate-900">{operation} Details</h3>
//           </div>


//   <div className="space-y-4">
//   {sections.map((section, index) => (
//     <OperationSection
//       key={index}
//       section={section}
//       renderField={renderField}
//     />
//   ))}
// </div>
//    {operation === 'Quotation' && (
//   <div
//     className="
//       mt-4
//       rounded-xl
//       border
//       border-slate-200
//       bg-white
//       shadow-sm
//       overflow-hidden
//     "
//   >
//     {/* Header */}
//     <div
//       className="
//         flex
//         items-center
//         justify-between
//         border-b
//         border-slate-200
//         bg-slate-50
//         px-4
//         py-3
//       "
//     >
//       <div>
//         <h3 className="text-sm font-semibold text-slate-900">
//           Quotation Services
//         </h3>

//         <p className="text-xs text-slate-500">
//           Generate service items based on selected containers
//         </p>
//       </div>

//       <button
//         type="button"
//         onClick={handleGetItems}
//         className="
//           h-9
//           rounded-lg
//           bg-[#006B82]
//           px-4
//           text-xs
//           font-semibold
//           text-white
//           shadow-sm
//           transition-all
//           hover:bg-[#005a6a]
//           hover:shadow-md
//         "
//       >
//         Get Items
//       </button>
//     </div>

//     {/* Empty State */}
//     {(!formData.items ||
//       formData.items.length === 0) && (
//       <div
//         className="
//           flex
//           flex-col
//           items-center
//           justify-center
//           px-4
//           py-8
//           text-center
//         "
//       >
//         <div className="mb-2 text-2xl">
//           📦
//         </div>

//         <h4 className="text-sm font-medium text-slate-700">
//           No service items generated
//         </h4>

//         <p className="mt-1 text-xs text-slate-500">
//           Click "Get Items" to create quotation items.
//         </p>
//       </div>
//     )}

//     {/* Table */}
//     {formData.items?.length > 0 && (
//       <>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr
//                 className="
//                   border-b
//                   border-slate-200
//                   bg-slate-50
//                 "
//               >
//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Item
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Qty
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Rate (PGK)
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Amount
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {formData.items.map(
//                 (item, idx) => (
//                   <tr
//                     key={idx}
//                     className="
//                       border-b
//                       border-slate-100
//                       transition-colors
//                       hover:bg-slate-50
//                     "
//                   >
//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       <div className="font-medium text-slate-900">
//                         {item.item_name}
//                       </div>

//                       {item.custom_container && (
//                         <div className="mt-1 text-xs text-slate-500">
//                           Container:{' '}
//                           {
//                             item.custom_container
//                           }
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       {item.qty}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       {Number(
//                         item.rate || 0
//                       ).toFixed(2)}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px] font-medium">
//                       {(
//                         Number(
//                           item.qty || 0
//                         ) *
//                         Number(
//                           item.rate || 0
//                         )
//                       ).toFixed(2)}
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer Summary */}
//         <div
//           className="
//             flex
//             justify-end
//             border-t
//             border-slate-200
//             bg-slate-50
//             px-4
//             py-3
//           "
//         >
//           <div className="w-72">
//             {/* <div className="flex justify-between text-sm">
//               <span className="text-slate-600">
//                 Total Items
//               </span>

//               <span className="font-medium">
//                 {
//                   formData.items.length
//                 }
//               </span>
//             </div> */}

//             <div
//               className="
//                 mt-2
//                 flex
//                 justify-between
//                 border-t
//                 border-slate-200
//                 pt-2
//                 text-base
//                 font-semibold
//               "
//             >
//               <span>Total</span>

//               <span>
//                 PGK{' '}
//                 {formData.items
//                   .reduce(
//                     (
//                       total,
//                       item
//                     ) =>
//                       total +
//                       Number(
//                         item.qty || 0
//                       ) *
//                         Number(
//                           item.rate || 0
//                         ),
//                     0
//                   )
//                   .toFixed(2)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </>
//     )}
//   </div>
// )}

// {operation === 'Sales Invoice' && (
//   <div
//     className="
//       mt-4
//       rounded-xl
//       border
//       border-slate-200
//       bg-white
//       shadow-sm
//       overflow-hidden
//     "
//   >
//     {/* Header */}
//     <div
//       className="
//         flex
//         items-center
//         justify-between
//         border-b
//         border-slate-200
//         bg-slate-50
//         px-4
//         py-3
//       "
//     >
//       <div>
//         <h3 className="text-sm font-semibold text-slate-900">
//           Sales Invoice Items
//         </h3>

//         <p className="text-xs text-slate-500">
//           Generate billable services
//         </p>
//       </div>

//       <button
//         type="button"
//         onClick={handleGetSalesInvoiceItems}
//         className="
//           h-9
//           rounded-lg
//           bg-[#006B82]
//           px-4
//           text-xs
//           font-semibold
//           text-white
//           shadow-sm
//           transition-all
//           hover:bg-[#005a6a]
//           hover:shadow-md
//         "
//       >
//         Get Items
//       </button>
//     </div>

//     {/* Empty State */}
//     {(!formData.items ||
//       formData.items.length === 0) && (
//       <div
//         className="
//           flex
//           flex-col
//           items-center
//           justify-center
//           px-4
//           py-8
//           text-center
//         "
//       >
//         <div className="mb-2 text-2xl">
//           💰
//         </div>

//         <h4 className="text-sm font-medium text-slate-700">
//           No invoice items generated
//         </h4>

//         <p className="mt-1 text-xs text-slate-500">
//           Click "Get Items" to generate invoice items.
//         </p>
//       </div>
//     )}

//     {/* Table */}
//     {formData.items?.length > 0 && (
//       <>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr
//                 className="
//                   border-b
//                   border-slate-200
//                   bg-slate-50
//                 "
//               >
//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Item
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Days
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Rate (PGK)
//                 </th>

//                 <th
//                   className="
//                     px-4
//                     py-2.5
//                     text-center
//                     text-xs
//                     font-semibold
//                     uppercase
//                     tracking-wider
//                     text-slate-500
//                   "
//                 >
//                   Amount
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {formData.items.map(
//                 (item, idx) => (
//                   <tr
//                     key={idx}
//                     className="
//                       border-b
//                       border-slate-100
//                       transition-colors
//                       hover:bg-slate-50
//                     "
//                   >
//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       <div className="font-medium text-slate-900">
//                         {item.item_name}
//                       </div>

//                       {item.description && (
//                         <div className="mt-1 text-xs text-slate-500">
//                           {item.description}
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       {item.qty}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px]">
//                       {Number(
//                         item.rate || 0
//                       ).toFixed(2)}
//                     </td>

//                     <td className="px-4 py-2.5 text-center text-[13px] font-medium">
//                       {Number(
//                         item.amount || 0
//                       ).toFixed(2)}
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer Summary */}
//         <div
//           className="
//             flex
//             justify-end
//             border-t
//             border-slate-200
//             bg-slate-50
//             px-4
//             py-3
//           "
//         >
//           <div className="w-72">
//             <div
//               className="
//                 mt-2
//                 flex
//                 justify-between
//                 border-t
//                 border-slate-200
//                 pt-2
//                 text-base
//                 font-semibold
//               "
//             >
//               <span>Total</span>

//               <span>
//                 PGK{' '}
//                 {formData.items
//                   .reduce(
//                     (total, item) =>
//                       total +
//                       Number(
//                         item.amount || 0
//                       ),
//                     0
//                   )
//                   .toFixed(2)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </>
//     )}
//   </div>
// )}

//           {submitState.error && (
//   <ErrorAlert
//     message={submitState.error}
//   />
// )}

// <div className="mt-6 flex justify-end gap-3">
//   <button
//     type="button"
//     onClick={() => navigate(-1)}
//     className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
//   >
//     Cancel
//   </button>

//   <button
//     type="button"
//     onClick={handleSubmit}
//     disabled={
//       submitState.loading ||
//       !operation
//     }
//     className="h-10 rounded-lg bg-[#006B82] px-4 text-xs font-semibold text-white transition hover:bg-[#005a6a] disabled:cursor-not-allowed disabled:bg-slate-400"
//   >
//     {submitState.loading
//       ? 'Creating...'
//       : `Create ${operation}`}
//   </button>
// </div>
//         </div>
//       </div>
//       <AlertDialog
//   open={alertDialog.open}
//   title={alertDialog.title}
//   message={alertDialog.message}
//   type={alertDialog.type}
//   onClose={() =>
//     setAlertDialog((prev) => ({
//       ...prev,
//       open: false,
//     }))
//   }
// />
//     </AppLayout>
//   )
// }
// SelectedOperationPage.jsx
import { useEffect, useMemo, useState } from 'react'
import api from '@/config/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useRef } from 'react'
import { operationStatusMap } from '../../config/operationStatusMap'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/common/Button'
import {
  getJobCardDetails,
  createAndSubmitOperationDocument,
} from '@/services/jobCardService'
import { handleFetchFrom } from '../../utils/handleFetchFrom'
import { getVisibleFields } from '../../utils/getVisibleFields'
import { getContainerDetails } from '@/services/containerService'
import { getAddress } from '@/services/addressService'
import {
  getDocTypeMeta,
  getChildTableMeta,
} from '@/services/operationMetaService'
import AlertDialog from '../../components/common/AlertDialog'
import { validateOperation } from '../../utils/operationValidation'
import { SYSTEM_FIELDS, HIDDEN_FIELD_TYPES } from '../../constants/fieldConstants'
import useOperationMeta from '../../hooks/useOperationMeta'
import { operationDocTypeMap } from '@/services/operationDoctypeMap'
import LinkField from '@/components/common/LinkField'
import DamageAnnotation from '@/components/job-card/DamageAnnotation'
import OperationSection from '../../components/operations/OperationSection'
import OperationField from '../../components/operations/OperationField'
import { buildSections, buildInitialFormData } from '../../components/operations/operationHelpers'
import { quotationRules } from '../../operations/quotation/quotationRules'
import { buildQuotationItems } from '../../operations/quotation/quotationItemBuilder'
import { buildSalesInvoiceItems } from '../../operations/salesInvoice/salesInvoiceItemBuilder'
import SalesInvoiceItemsCard from '../../components/operations/SalesInvoiceItemsCard'
import ErrorAlert from '../../components/common/ErrorAlert'
import { validateContainerStatusChange } from '../../utils/validateContainerStatus'
import { getERPErrorMessage } from '../../utils/getERPErrorMessage'
import { useAuth } from '../../hooks/useAuth'

const jobCardFieldMap = {
  'Gate In': 'job_card',
  'Gate Out': 'job_card',
  'Equipment Interchange Receipt': 'job_card',
  Quotation: 'custom_job_card',
  'Sales Invoice': 'custom_container_job_card',
  'Pickup & Delivery Docket': 'job_card_number',
}


const fieldSupportsFullWidth = (fieldType) =>
  ['Text', 'Small Text', 'Text Editor'].includes(fieldType)

const getDoctype = (operation) => operationDocTypeMap[operation]

const getCurrentTime = () =>
  new Date().toLocaleTimeString('en-GB', {
    hour12: false,
  })

export default function SelectedOperationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [jobCard, setJobCard] = useState(null)
  const [selectedContainers, setSelectedContainers] = useState([])
  const [containerDetails, setContainerDetails] = useState([])
  const [operation, setOperation] = useState('')
  // const [meta, setMeta] = useState(null)
  const [formData, setFormData] = useState({})
  const jobCardField = jobCardFieldMap[operation]
  const [loading, setLoading] = useState(true)
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: null,
    success: false,
  })
  const [error, setError] = useState('')
  const [alertDialog, setAlertDialog] =
    useState({
      open: false,
      title: '',
      message: '',
      type: 'error',
    })

  const [damageMarkers, setDamageMarkers] =
    useState([])
  const damageAnnotationApi = useRef(null)

  const [confirmedDamageImage,
    setConfirmedDamageImage] =
    useState('')

  const showStorageStart =
    operation === 'Gate In' &&
    selectedContainers.some(
      (container) =>
        container.startsWith('CSL')
    )


  const handleGetItems = async () => {
    console.log('GET ITEMS CLICKED')

    const validation =
      quotationRules.validateBeforeGetItems(
        formData
      )

    console.log(
      'VALIDATION RESULT',
      validation
    )

    // --- CHANGED FROM NATIVE ALERT TO CUSTOM ALERT DIALOG ---
    if (!validation.valid) {
      setAlertDialog({
        open: true,
        title: 'Quotation Validation Failed',
        message: validation.message,
        type: 'error',
      })
      return
    }

    console.log(
      'FORM DATA',
      formData
    )

    console.log(
      'CONTAINER DETAILS',
      containerDetails
    )

    const items =
      await buildQuotationItems({
        formData,
        containerDetails,
      })

    console.log(
      'GENERATED ITEMS',
      items
    )

    setFormData((prev) => ({
      ...prev,
      items,
    }))
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const operationValue = params.get('operation')
    const containersParam = params.get('containers')

    setOperation(operationValue || '')

    if (containersParam) {
      try {
        const parsedContainers = JSON.parse(containersParam)
        if (Array.isArray(parsedContainers)) {
          setSelectedContainers(parsedContainers)
        }
      } catch (error) {
        console.error('Unable to load selected containers:', error)
      }
    }
  }, [location.search])

  useEffect(() => {
    const fetchJobCard = async () => {
      if (!id) return

      try {
        const data = await getJobCardDetails(id)
        setJobCard(data)
      } catch (error) {
        console.error('Failed to load job card details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobCard()
  }, [id])

  const {
    meta,
    tableMeta,
    loadingMeta,
  } = useOperationMeta(
    operation
  )

  useEffect(() => {
    if (!containerDetails.length) {
      return
    }

    if (operation === 'Quotation') {
      setFormData(prev => ({
        ...prev,
        custom_container: containerDetails.map(container => ({
          container: container.container_number,
          container_owner: container.owner_name,
          type: container.item,
          status: container.status,
        })),
      }))
    }

  }, [
    operation,
    containerDetails,
  ])

  useEffect(() => {
    const fetchSelectedContainerDetails = async () => {
      if (!selectedContainers.length) {
        setContainerDetails([])
        return
      }

      try {
        const details = await Promise.all(
          selectedContainers.map((containerName) =>
            getContainerDetails(containerName)
          )
        )
        setContainerDetails(details)
      } catch (error) {
        console.error('Failed to fetch selected container details:', error)
        setContainerDetails([])
      }
    }

    fetchSelectedContainerDetails()
  }, [selectedContainers])

  const evaluateExpression = (
    expression,
    formData
  ) => {
    if (!expression) {
      return true
    }

    if (
      expression.startsWith('eval:')
    ) {
      try {
        const fn = new Function(
          'doc',
          `return (${expression.replace(
            'eval:',
            ''
          )})`
        )

        return !!fn(formData)
      } catch (err) {
        console.error(err)
        return true
      }
    }

    return true
  }

  const evaluateDependsOn = (
    field,
    formData
  ) => {
    const dependsResult =
      evaluateExpression(
        field.depends_on,
        formData
      )

    const mandatoryResult =
      evaluateExpression(
        field.mandatory_depends_on,
        formData
      )

    return (
      dependsResult &&
      mandatoryResult
    )
  }

  const visibleFields =
    useMemo(
      () =>
        getVisibleFields({
          meta,
          operation,
          formData,
          showStorageStart,
        }),
      [
        meta,
        operation,
        formData,
        showStorageStart,
      ]
    )

  const sections = useMemo(
    () => buildSections(visibleFields),
    [visibleFields]
  )

  const initializedRef = useRef(false)

  useEffect(() => {
    if (!jobCard || !meta) return

    if (initializedRef.current) return

    initializedRef.current = true

    const defaults =
      buildInitialFormData({
        visibleFields,
        jobCard,
        operation,
        selectedContainers,
        jobCardField,
        currentUser: user,
      })

    if (operation === 'Quotation') {
      defaults.custom_container =
        containerDetails.map(
          (container) => ({
            container:
              container.container_number ||
              container.name,

            container_owner:
              container.owner_name ||
              jobCard.customer,

            type:
              container.item ||
              container.container_type ||
              '',

            status:
              container.status || '',
          })
        )
    } else if (operation === 'Sales Invoice') {
      defaults.custom_container =
        containerDetails.map(
          (container) => ({
            container:
              container.container_number ||
              container.name,

            container_owner:
              container.owner_name ||
              jobCard.customer,

            type:
              container.item ||
              container.container_type ||
              '',

            status:
              container.status || '',
          })
        )
    }
    else if (operation === 'Pickup & Delivery Docket') {
      defaults.container =
        containerDetails.map(
          (container) => ({
            container:
              container.container_number ||
              container.name,

            container_owner:
              container.owner_name ||
              jobCard.customer,

            type:
              container.item ||
              container.container_type ||
              '',

            status:
              container.status || '',
            trip_type: '',
            cartage_type: '',
            zone: '',
          })
        )
    }


    if (
      operation === 'Sales Invoice' &&
      visibleFields.some(
        (field) =>
          field.fieldname === 'posting_time'
      )
    ) {
      defaults.posting_time =
        getCurrentTime()
    }

    if (
      operation === 'Sales Invoice' &&
      visibleFields.some(
        (field) =>
          field.fieldname === 'set_posting_time'
      )
    ) {
      defaults.set_posting_time = 0
    }

    setFormData((prev) => ({
      ...defaults,
      ...prev,
    }))
  }, [
    jobCard,
    meta,
    operation,
    selectedContainers,
    // visibleFields,
    jobCardField,
    user,
    containerDetails,
  ])

  useEffect(() => {
    initializedRef.current = false
  }, [operation])

  const handleFieldChange = async (
    fieldname,
    value
  ) => {
    // ----------------------------
    // Special Case: Taxes and Charges Change
    // ----------------------------
    if (operation === 'Sales Invoice' && fieldname === 'taxes_and_charges') {
      let taxRate = 0
      if (value) {
        try {
          const response = await api.get('/method/frappe.client.get', {
            params: {
              doctype: 'Sales Taxes and Charges Template',
              name: value,
            },
          })
          const templateDoc = response.data?.message
          if (templateDoc) {
            const childTable = Object.values(templateDoc).find(
              (val) => Array.isArray(val) && val.some((row) => 'rate' in row)
            )
            if (childTable && childTable.length > 0) {
              taxRate = Number(childTable[0].rate || 0)
            }
          }
        } catch (err) {
          console.error('Error fetching tax rate on field change:', err)
        }
      }

      console.log('Tax Rate:', taxRate)

      const totalAmount = (formData.items || []).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      )
      const taxedAmount = totalAmount * (taxRate / 100)
      const grandTotal = totalAmount + taxedAmount

      setFormData((prev) => ({
        ...prev,
        taxes_and_charges: value,
        total: totalAmount,
        net_total: totalAmount,
        grand_total: grandTotal,
      }))

      return
    }


    // ----------------------------
    // Special Case: Docket Type
    // ----------------------------
    if (fieldname === 'docket_type') {
      if (value === 'Pickup') {
        setFormData(prev => ({
          ...prev,
          docket_type: value,
          delivery_date_time: '',
        }))
      }

      if (value === 'Delivery') {
        setFormData(prev => ({
          ...prev,
          docket_type: value,
          pickup_date_time: '',
        }))
      }

      return
    }

    // ----------------------------
    // Special Case: Posting Time
    // ----------------------------
    if (
      operation === 'Sales Invoice' &&
      fieldname === 'set_posting_time'
    ) {
      setFormData(prev => ({
        ...prev,
        set_posting_time: value,
        posting_time:
          value === 1 || value === true
            ? prev.posting_time ||
            getCurrentTime()
            : getCurrentTime(),
      }))

      return
    }

    // ----------------------------
    // Update Changed Field First
    // ----------------------------
    setFormData(prev => ({
      ...prev,
      [fieldname]: value,
    }))

    // ----------------------------
    // Generic fetch_from Support
    // ----------------------------
    const changedField =
      meta?.fields?.find(
        f => f.fieldname === fieldname
      )

    const fetchTargets =
      meta?.fields?.filter(
        f =>
          f.fetch_from?.startsWith(
            `${fieldname}.`
          )
      ) || []

    if (
      changedField?.fieldtype === 'Link' &&
      value &&
      fetchTargets.length
    ) {
      try {
        const linkedDoc =
          await getDoc(
            changedField.options,
            value
          )

        const updates = {}

        fetchTargets.forEach(
          targetField => {
            const sourceField =
              targetField.fetch_from
                .split('.')[1]

            updates[
              targetField.fieldname
            ] =
              linkedDoc?.[
              sourceField
              ] || ''
          }
        )

        setFormData(prev => ({
          ...prev,
          ...updates,
        }))
      } catch (err) {
        console.error(
          'Fetch From Error:',
          err
        )
      }
    }

    // ----------------------------
    // Origin Address
    // ----------------------------
    if (
      fieldname ===
      'custom_choose_origin_address'
    ) {
      try {
        const address =
          await getAddress(value)

        setFormData(prev => ({
          ...prev,
          custom_from_location:
            address.address_line1 ||
            address.address_title ||
            '',
        }))
      } catch (err) {
        console.error(err)
      }
    }

    // ----------------------------
    // Destination Address
    // ----------------------------
    if (
      fieldname ===
      'custom_choose_destination_address'
    ) {
      try {
        const address =
          await getAddress(value)

        setFormData(prev => ({
          ...prev,
          custom_to_location:
            address.address_line1 ||
            address.address_title ||
            '',
        }))
      } catch (err) {
        console.error(err)
      }
    }

    // ----------------------------
    // Pickup Address
    // ----------------------------
    if (fieldname === 'from') {
      try {
        const address =
          await getAddress(value)

        setFormData(prev => ({
          ...prev,
          from_address:
            address.address_line1 ||
            address.address_title ||
            '',
        }))
      } catch (err) {
        console.error(
          'Unable to fetch from address',
          err
        )
      }
    }

    // ----------------------------
    // Delivery Address
    // ----------------------------
    if (fieldname === 'to') {
      try {
        const address =
          await getAddress(value)

        setFormData(prev => ({
          ...prev,
          to_address:
            address.address_line1 ||
            address.address_title ||
            '',
        }))
      } catch (err) {
        console.error(
          'Unable to fetch to address',
          err
        )
      }
    }
  }
  const renderField = (field) => (
    <OperationField
      field={field}
      value={formData[field.fieldname]}
      formData={formData}
      operation={operation}
      jobCardField={jobCardField}
      onChange={handleFieldChange}
      tableMeta={tableMeta}
    />
  )

  const containerTableField =
    operation === 'Quotation' ||
      operation === 'Sales Invoice'
      ? 'custom_container'
      : 'container'

  const handleGetSalesInvoiceItems =
    async () => {
      const items =
        await buildSalesInvoiceItems({
          jobCard,
          formData,
          containerDetails,
        })

      let taxRate = 0
      if (formData.taxes_and_charges) {
        try {
          // Fetch the template document via Frappe API
          const response = await api.get('/method/frappe.client.get', {
            params: {
              doctype: 'Sales Taxes and Charges Template',
              name: formData.taxes_and_charges,
            },
          })
          const templateDoc = response.data?.message
          if (templateDoc) {
            // Robust search for the child table containing the 'rate' property
            const childTable = Object.values(templateDoc).find(
              (val) => Array.isArray(val) && val.some((row) => 'rate' in row)
            )
            if (childTable && childTable.length > 0) {
              taxRate = Number(childTable[0].rate || 0)
            }
          }
        } catch (err) {
          console.error('Error fetching tax rate:', err)
        }
      }

      // Print the rate in the console
      console.log('Tax Rate:', taxRate)

      // Calculate total amount, tax amount, and grand total
      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      )
      const taxedAmount = totalAmount * (taxRate / 100)
      const grandTotal = totalAmount + taxedAmount

      setFormData((prev) => ({
        ...prev,
        items,
        total: totalAmount,
        net_total: totalAmount,
        grand_total: grandTotal,
      }))
    }
  const getSubmissionData = () => {
    const data = { ...formData }

    if (jobCardField && jobCard?.name) {
      data[jobCardField] = jobCard.name
    }

    if (
      operation === 'Gate In' ||
      operation === 'Gate Out'
    ) {
      data.container = selectedContainers.map(
        (containerName) => ({
          container: containerName,
        })
      )
    }

    if (operation === 'Quotation') {
      const today = new Date()

      const validTill = new Date()
      validTill.setDate(
        validTill.getDate() + 30
      )

      data.naming_series =
        'SAL-QTN-.YYYY.-'

      data.quotation_to =
        'Customer'

      data.party_name =
        jobCard.customer

      data.customer_name =
        jobCard.customer

      data.company =
        'CS Logistics'

      data.currency = 'PGK'

      data.selling_price_list =
        'Standard Selling'

      data.price_list_currency =
        'INR'

      data.transaction_date =
        today.toISOString().split('T')[0]

      data.valid_till =
        validTill
          .toISOString()
          .split('T')[0]

      data.custom_job_card =
        jobCard.name

      // Build Container Child Table
      data.custom_container =
        containerDetails.map(
          (container, index) => ({
            container:
              container.container_number ||
              container.name,

            container_owner:
              container.owner_name ||
              jobCard.customer,

            type:
              container.item ||
              container.container_type ||
              '',

            status:
              container.status || '',
          })
        )

      // Build Items Table
      data.items =
        formData.items || []

        // ERP Required Numeric Fields
        ;[
          'base_net_total',
          'net_total',
          'base_total',
          'total',
          'grand_total',
          'base_grand_total',
          'rounded_total',
          'base_rounded_total',
          'base_total_taxes_and_charges',
          'total_taxes_and_charges',
        ].forEach((field) => {
          data[field] =
            Number(data[field] || 0)
        })
    }

    if (
      operation ===
      'Pickup & Delivery Docket'
    ) {
      data.naming_series =
        data.docket_type === 'Delivery'
          ? 'Delivery-'
          : 'Pickup-'

      // FIXED: Changed to preserve user-filled table values (trip_type, cartage_type, zone) from formData
      data.container = (formData.container || []).map(
        (c) => ({
          ...c,
          status: c.status || 'In Transit',
        })
      )
    }
    if (
      operation ===
      'Equipment Interchange Receipt'
    ) {
      data.container =
        selectedContainers.map(
          (containerName) => ({
            container:
              containerName,
          })
        )

      data.damage_annotation_image =
        formData.damage_annotation_image
    }

    // if (operation === 'Sales Invoice') {
    //   data.customer = jobCard.customer

    //   data.custom_container =
    //   formData.custom_container || []

    //   data.company = 'CS Logistics'

    //   data.currency = 'PGK'

    //   data.posting_date =
    //     data.posting_date ||
    //     new Date().toISOString().split('T')[0]

    //   data.due_date =
    //     data.due_date ||
    //     new Date().toISOString().split('T')[0]

    //   data.custom_container_job_card =
    //     jobCard.name

    //  data.items =
    //   formData.items || []

    //   data.base_net_total = 0
    //   data.net_total = 0
    //   data.base_total = 0
    //   data.total = 0
    //   data.grand_total = 0
    //   data.base_grand_total = 0
    //   data.rounded_total = 0
    //   data.base_rounded_total = 0
    // }
    if (operation === 'Sales Invoice') {
      data.customer = jobCard.customer

      data.custom_container =
        formData.custom_container || []

      data.company = 'CS Logistics'

      data.currency = 'PGK'

      data.posting_date =
        data.posting_date ||
        new Date().toISOString().split('T')[0]

      data.due_date =
        data.due_date ||
        new Date().toISOString().split('T')[0]

      data.custom_container_job_card =
        jobCard.name

      data.items =
        formData.items || []

      const totalAmount = (data.items || []).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      )

      // Submit actual values rather than resetting to 0
      data.total = totalAmount
      data.net_total = totalAmount
      data.base_total = totalAmount
      data.base_net_total = totalAmount
      data.grand_total = formData.grand_total || totalAmount
      data.base_grand_total = formData.grand_total || totalAmount
      data.rounded_total = formData.grand_total || totalAmount
      data.base_rounded_total = formData.grand_total || totalAmount
    }

    return data
  }



  const uploadDamageImage = async () => {
    console.log(
      'damageAnnotationApi.current',
      damageAnnotationApi.current
    )
    if (!damageAnnotationApi.current) {
      console.error('DamageAnnotation ref missing')
      return null
    }

    const base64 =
      damageAnnotationApi.current.exportImage()

    console.log('Base64 Generated:', !!base64)

    if (!base64) {
      console.error('No image generated')
      return null
    }

    const blob = await (
      await fetch(base64)
    ).blob()

    console.log('Blob Size:', blob.size)

    const uploadFormData =
      new FormData()

    uploadFormData.append(
      'file',
      blob,
      `eir-damage-${Date.now()}.png`
    )

    uploadFormData.append(
      'is_private',
      0
    )

    const response = await api.post(
      '/method/upload_file',
      uploadFormData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    )

    console.log(
      'UPLOAD RESPONSE:',
      response.data
    )

    return (
      response.data?.message
        ?.file_url || null
    )
  }

  const handleConfirmDamageImage =
    async () => {
      try {
        const uploadedFileUrl =
          await uploadDamageImage()

        console.log(
          'Uploaded File URL:',
          uploadedFileUrl
        )

        setConfirmedDamageImage(
          uploadedFileUrl
        )

        setFormData((prev) => ({
          ...prev,
          damage_annotation_image:
            uploadedFileUrl,
        }))
      } catch (error) {
        console.error(
          'Failed to upload damage image',
          error
        )
      }
    }

  const validateMandatoryFields = () => {
    if (!meta?.fields) {
      return {
        valid: true,
      }
    }

    const missingFields = meta.fields.filter(
      (field) => {
        const isMandatory =
          field.reqd === 1

        const isVisibleOnApp =
          field.show_on_app === 1

        if (
          !isMandatory ||
          isVisibleOnApp
        ) {
          return false
        }

        const value =
          formData[field.fieldname]

        if (
          field.fieldtype === 'Check'
        ) {
          return false
        }

        return (
          value === undefined ||
          value === null ||
          value === ''
        )
      }
    )

    return {
      valid: missingFields.length === 0,
      missingFields,
    }
  }

  const handleSubmit = async () => {
    const validation =
      validateOperation({
        operation,
        formData,
        selectedContainers,
        containerDetails,
        showStorageStart,
        operationStatusMap,
        validateContainerStatusChange,
      })

    if (!validation.valid) {
      setSubmitState({
        loading: false,
        error: validation.message,
        success: false,
      })

      return
    }

    const doctype =
      getDoctype(operation)

    if (!doctype) {
      setSubmitState({
        loading: false,
        error:
          'Unable to determine document type.',
        success: false,
      })

      return
    }



    const mandatoryValidation =
      validateMandatoryFields()

    if (!mandatoryValidation.valid) {
      const fieldNames =
        mandatoryValidation.missingFields
          .map(
            (field) =>
              field.label ||
              field.fieldname
          )
          .join(', ')

      setAlertDialog({
        open: true,
        title: 'Required Fields Missing',
        message: `Please fill the following required fields:\n${fieldNames}`,
        type: 'error',
      })

      return
    }

    // FIXED: Added validation check specifically for 'Pickup & Delivery Docket' child table containers
    if (operation === 'Pickup & Delivery Docket') {
      const currentContainers = formData.container || []

      const hasIncompleteRow = currentContainers.some(
        (c) => !c.trip_type || !c.cartage_type || !c.zone
      )

      if (hasIncompleteRow) {
        setAlertDialog({
          open: true,
          title: 'Container Details Required',
          message: 'Please fill in the Trip Type, Cartage Type, and Zone fields for all containers in the list before creating the docket.',
          type: 'error',
        })
        return
      }
    }

    setSubmitState({
      loading: true,
      error: null,
      success: false,
    })

    try {
      const payload =
        getSubmissionData()

      console.log(
        `FINAL ${operation.toUpperCase()} PAYLOAD`,
        JSON.stringify(
          payload,
          null,
          2
        )
      )

      const response =
        await createAndSubmitOperationDocument(
          doctype,
          payload
        )

      console.log(
        `Created ${operation}:`,
        response
      )

      setSubmitState({
        loading: false,
        error: null,
        success: true,
      })

      navigate(
        `/job-cards/${encodeURIComponent(
          id
        )}`
      )
    } catch (error) {
      console.error(
        `Failed to create ${operation}:`,
        error
      )

      setSubmitState({
        loading: false,
        error:
          getERPErrorMessage(error),
        success: false,
      })
    }
  }

  return (
    <AppLayout
      title={`Create New ${operation || ''}`}
      description={
        jobCard?.name
          ? `Create ${operation || 'operation'} for ${jobCard.name}`
          : 'Review selected operation and containers'
      }
    >
      <div className="max-w-[1300px] mx-auto space-y-4 pb-4">


        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Job Card No.
              </div>
              <h1 className="mt-1 flex flex-wrap items-center gap-2 text-lg font-bold text-[#006B82]">
                <span>{loading ? 'Loading...' : jobCard?.name || 'N/A'}</span>
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {operation || 'Operation'}
                </span>
              </h1>
            </div>

            <div className="lg:border-l lg:border-slate-100 lg:pl-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</div>
              <h2 className="mt-1 truncate text-sm font-semibold text-slate-900">{jobCard?.customer || 'N/A'}</h2>
              <div className="mt-1 truncate text-xs text-slate-500">{jobCard?.customer_contact || ''}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Selected Containers ({selectedContainers.length})
              </div>
              {selectedContainers.length === 0 ? (
                <div className="p-4 text-xs text-slate-600">
                  No containers selected. Please go back and choose at least one container.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Container No.
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Owner
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Type
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedContainers.map((containerName) => {
                        const container =
                          containerDetails.find(
                            (ct) =>
                              ct.container_number === containerName ||
                              ct.name === containerName
                          ) || { container_number: containerName }

                        return (
                          <tr
                            key={containerName}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-4 py-2.5 text-[13px] font-semibold text-slate-900">
                              {container.container_number ||
                                containerName}
                            </td>

                            <td className="px-4 py-2.5 text-[13px] text-slate-600">
                              {container.owner_name ||
                                jobCard?.customer ||
                                'N/A'}
                            </td>

                            <td className="px-4 py-2.5 text-[13px] text-slate-600">
                              {container.item ||
                                container.container_type ||
                                'N/A'}
                            </td>

                            <td className="px-4 py-2.5 text-[13px] text-slate-600">
                              {/* <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"> */}
                              {container.size || 'N/A'}
                              {/* </span> */}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {operation === 'Equipment Interchange Receipt' && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Damage Annotation
              </h3>
            </div>
            <DamageAnnotation
              onChange={setDamageMarkers}
              onReady={(api) => {
                console.log(
                  'ONREADY CALLED',
                  api
                )

                damageAnnotationApi.current = api
              }}
            />
            {damageMarkers?.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleConfirmDamageImage}
                >
                  Confirm Damage Image
                </Button>
              </div>
            )}


            {confirmedDamageImage && (
              <div
                className="
                      mt-4
                      rounded-lg
                      border
                      border-emerald-200
                      bg-emerald-50
                      p-4
                    "
              >
                <div
                  className="
                        text-sm
                        font-medium
                        text-emerald-700
                      "
                >
                  Damage annotation image
                  confirmed
                </div>

                <div className="mt-2">
                  <img
                    src={confirmedDamageImage}
                    alt="Damage Annotation"
                    className="
                          max-h-48
                          rounded-lg
                          border
                        "
                  />
                </div>
              </div>
            )}
          </div>
        )}



        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">{operation} Details</h3>
          </div>


          <div className="space-y-4">
            {sections.map((section, index) => (
              <OperationSection
                key={index}
                section={section}
                renderField={renderField}
              />
            ))}
          </div>
          {operation === 'Quotation' && (
            <div
              className="
      mt-4
      rounded-xl
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
                    Quotation Services
                  </h3>

                  <p className="text-xs text-slate-500">
                    Generate service items based on selected containers
                  </p>
                </div>

                <Button
                  onClick={handleGetItems}
                  size="sm"
                >
                  Get Items
                </Button>
              </div>

              {/* Empty State */}
              {(!formData.items ||
                formData.items.length === 0) && (
                  <div
                    className="
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-8
          text-center
        "
                  >
                    <div className="mb-2 text-2xl">
                      📦
                    </div>

                    <h4 className="text-sm font-medium text-slate-700">
                      No service items generated
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Click "Get Items" to create quotation items.
                    </p>
                  </div>
                )}

              {/* Table */}
              {formData.items?.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr
                          className="
                  border-b
                  border-slate-200
                  bg-slate-50
                "
                        >
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
                            Qty
                          </th>

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
                            Rate (PGK)
                          </th>

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
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.items.map(
                          (item, idx) => (
                            <tr
                              key={idx}
                              className="
                      border-b
                      border-slate-100
                      transition-colors
                      hover:bg-slate-50
                    "
                            >
                              <td className="px-4 py-2.5 text-center text-[13px]">
                                <div className="font-medium text-slate-900">
                                  {item.item_name}
                                </div>

                                {item.custom_container && (
                                  <div className="mt-1 text-xs text-slate-500">
                                    Container:{' '}
                                    {
                                      item.custom_container
                                    }
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-2.5 text-center text-[13px]">
                                {item.qty}
                              </td>

                              <td className="px-4 py-2.5 text-center text-[13px]">
                                {Number(
                                  item.rate || 0
                                ).toFixed(2)}
                              </td>

                              <td className="px-4 py-2.5 text-center text-[13px] font-medium">
                                {(
                                  Number(
                                    item.qty || 0
                                  ) *
                                  Number(
                                    item.rate || 0
                                  )
                                ).toFixed(2)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Summary */}
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
                      {/* <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Total Items
              </span>

              <span className="font-medium">
                {
                  formData.items.length
                }
              </span>
            </div> */}

                      <div
                        className="
                mt-2
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
                          PGK{' '}
                          {formData.items
                            .reduce(
                              (
                                total,
                                item
                              ) =>
                                total +
                                Number(
                                  item.qty || 0
                                ) *
                                Number(
                                  item.rate || 0
                                ),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {operation === 'Sales Invoice' && (
            <div
              className="
      mt-4
      rounded-xl
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

                <Button
                  onClick={handleGetSalesInvoiceItems}
                  size="sm"
                >
                  Get Items
                </Button>
              </div>

              {/* Empty State */}
              {(!formData.items ||
                formData.items.length === 0) && (
                  <div
                    className="
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-8
          text-center
        "
                  >
                    <div className="mb-2 text-2xl">
                      💰
                    </div>

                    <h4 className="text-sm font-medium text-slate-700">
                      No invoice items generated
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Click "Get Items" to generate invoice items.
                    </p>
                  </div>
                )}

              {/* Table */}
              {formData.items?.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr
                          className="
                  border-b
                  border-slate-200
                  bg-slate-50
                "
                        >
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
                            Days
                          </th>

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
                            Rate (PGK)
                          </th>

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
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.items.map(
                          (item, idx) => (
                            <tr
                              key={idx}
                              className="
                      border-b
                      border-slate-100
                      transition-colors
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
                                {Number(
                                  item.rate || 0
                                ).toFixed(2)}
                              </td>

                              <td className="px-4 py-2.5 text-center text-[13px] font-medium">
                                {Number(
                                  item.amount || 0
                                ).toFixed(2)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Summary */}
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
                mt-2
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
                          PGK{' '}
                          {formData.items
                            .reduce(
                              (total, item) =>
                                total +
                                Number(
                                  item.amount || 0
                                ),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {submitState.error && (
            <ErrorAlert
              message={submitState.error}
            />
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!operation}
              loading={submitState.loading}
            >
              {`Create ${operation}`}
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog
        open={alertDialog.open}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        onClose={() =>
          setAlertDialog((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </AppLayout>
  )
}