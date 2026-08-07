import { useEffect, useState } from 'react'
import {
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

import AppLayout from '@/components/layout/AppLayout'
import { getCustomers, getCustomerDetails } from '@/services/customerService'
import Pagination from '@/components/common/Pagination'
import usePagination from '@/hooks/usePagination'
import CustomerDetailsModal from './CustomerDetailsModal'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
  useState(null)

const [showDetailsModal, setShowDetailsModal] =
  useState(false)

const [loadingDetails, setLoadingDetails] =
  useState(false)

useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers()
        console.log('Customers:', data)
        setCustomers(data || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
  const search = searchTerm.toLowerCase()

  return (
    customer.name?.toLowerCase().includes(search) ||
    customer.customer_name?.toLowerCase().includes(search) ||
    customer.customer_type?.toLowerCase().includes(search) ||
    customer.customer_group?.toLowerCase().includes(search) ||
    customer.territory?.toLowerCase().includes(search) ||
    customer.email_id?.toLowerCase().includes(search) ||
    customer.mobile_no?.toLowerCase().includes(search)
  )
})

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedCustomers,
  pageSize,
} = usePagination(filteredCustomers)

useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])
const handleCustomerClick = async (
  customer
) => {
  try {
    setLoadingDetails(true)

    const fullCustomer =
      await getCustomerDetails(
        customer.name
      )

    setSelectedCustomer(fullCustomer)
    setShowDetailsModal(true)
  } catch (error) {
    console.error(error)
  } finally {
    setLoadingDetails(false)
  }
}
  return (
    <AppLayout
      title="Customers"
      description="Manage customer records and contact details."
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search */}
        <div className="flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-slate-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="
                w-full
                h-10
                pl-10
                pr-4
                rounded-lg
                border
                border-slate-200
                bg-white
                text-xs
                shadow-sm
                outline-none
                focus:ring-2
                focus:ring-[#006B82]
                transition-all
              "
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className="
              grid
              grid-cols-12
              px-5
              py-3
              bg-slate-50
              border-b
              border-slate-200
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            <div className="col-span-3 text-left px-2">Customer</div>
            <div className="col-span-2 text-left">Type</div>
            <div className="col-span-2 text-left">Group</div>
            <div className="col-span-2 text-left">Territory</div>
            <div className="col-span-3 text-left">Contact</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No customers found.
              </div>
            ) : (
              paginatedCustomers.map((customer) => (
                <div
  key={customer.name}
  onClick={() =>
    handleCustomerClick(customer)
  }
  className="
    grid
    grid-cols-12
    items-center
    px-5
    py-3
    hover:bg-slate-50
    transition-all
    cursor-pointer
  "
>
                  {/* Customer Info */}
                  <div className="col-span-3 flex items-center gap-3 px-2 min-w-0">
                    <div
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-cyan-50
                        text-cyan-600
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Building2 size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-[#0B2257] text-[13px] truncate">
                        {customer.customer_name || customer.name}
                      </div>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {customer.customer_type || '-'}
                  </div>

                  {/* Group */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {customer.customer_group || '-'}
                  </div>

                  {/* Territory */}
                  <div className="col-span-2 flex items-center gap-2 text-[13px] text-slate-600">
                    <MapPin size={13} className="text-slate-400" />
                    <span className="truncate">{customer.territory || '-'}</span>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 space-y-0.5 text-left text-[13px] text-slate-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email_id || '-'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{customer.mobile_no || '-'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
  <div className="text-xs text-slate-500">
    Showing{' '}
    {filteredCustomers.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1}
    {' '}to{' '}
    {Math.min(
      currentPage * pageSize,
      filteredCustomers.length
    )}
    {' '}of {filteredCustomers.length} customers
  </div>

  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
</div>
      </div>
      {showDetailsModal &&
  selectedCustomer && (
    <CustomerDetailsModal
      customer={selectedCustomer}
      onClose={() => {
        setShowDetailsModal(false)
        setSelectedCustomer(null)
      }}
    />
  )}
    </AppLayout>
  )
}
