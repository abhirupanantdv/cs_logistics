import { useEffect, useState } from 'react'
import {
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
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
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:max-w-md">
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
          {/* Desktop Table View (md and above) */}
          <div className="hidden md:block">
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
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate pr-2">
                      {customer.customer_type || '-'}
                    </div>

                    {/* Group */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate pr-2">
                      {customer.customer_group || '-'}
                    </div>

                    {/* Territory */}
                    <div className="col-span-2 flex items-center gap-2 text-[13px] text-slate-600 min-w-0 pr-2">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{customer.territory || '-'}</span>
                    </div>

                    {/* Contact */}
                    <div className="col-span-3 space-y-0.5 text-left text-[13px] text-slate-600 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{customer.email_id || '-'}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{customer.mobile_no || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Card View (below md) */}
          <div className="block md:hidden divide-y divide-slate-100">
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
                  onClick={() => handleCustomerClick(customer)}
                  className="
                    p-4
                    hover:bg-slate-50/80
                    active:bg-slate-100
                    cursor-pointer
                    transition-all
                    space-y-3
                  "
                >
                  {/* Header row: Icon + Name + Chevron */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
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
                      <span className="font-semibold text-[#0B2257] text-sm truncate">
                        {customer.customer_name || customer.name}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                  </div>

                  {/* Details grid: Type & Group, Territory, Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Type / Group
                      </span>
                      <span className="font-medium text-slate-700">
                        {customer.customer_type || '-'}
                        {customer.customer_group ? ` • ${customer.customer_group}` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Territory
                      </span>
                      <div className="flex items-center gap-1 font-medium text-slate-700 truncate">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{customer.territory || '-'}</span>
                      </div>
                    </div>

                    {(customer.email_id || customer.mobile_no) && (
                      <div className="col-span-1 sm:col-span-2 pt-1 border-t border-slate-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                        {customer.email_id && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{customer.email_id}</span>
                          </div>
                        )}
                        {customer.mobile_no && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Phone size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{customer.mobile_no}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-center sm:text-left">
          <div className="text-xs text-slate-500 order-2 sm:order-1">
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

          <div className="order-1 sm:order-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
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
