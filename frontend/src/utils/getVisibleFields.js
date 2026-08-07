

// utils/getVisibleFields.js

import {
  HIDDEN_FIELD_TYPES,
  SYSTEM_FIELDS,
} from '@/constants/fieldConstants'

import { evaluateDependsOn } from './evaluateDependsOn'

export function getVisibleFields({
  meta,
  operation,
  formData,
  showStorageStart,
}) {
  return (
    meta?.fields?.filter(
      (field, index, fields) => {

        if (
          field.fieldname ===
            'storage_start' &&
          !showStorageStart
        ) {
          return false
        }

        // --- HARD EXCEPTION FOR QUOTATION FIELDS ---
        // Force these specific Quotation fields to bypass all show_on_app checks
        const quotationExceptions = [
          'custom_container',
          'custom_service_type',
          'custom_pobl_no',
          'custom_vessel',
          'custom_voyage_no',
          'custom_job_card',
          'custom_choose_origin_address',
          'custom_choose_destination_address',
          'custom_from_location',
          'custom_to_location',
          "custom_section_break_3d3bt"
        ]

        if (operation === 'Quotation' && quotationExceptions.includes(field.fieldname)) {
          return true
        }

        if (
          operation ===
          'Pickup & Delivery Docket'
        ) {
          if (
            field.depends_on ===
            "eval:doc.docket_type == 'Pickup'"
          ) {
            return (
              formData.docket_type ===
              'Pickup'
            )
          }

          if (
            field.depends_on ===
            "eval:doc.docket_type == 'Delivery'"
          ) {
            return (
              formData.docket_type ===
              'Delivery'
            )
          }
        }

        if (
          field.fieldtype ===
          'Section Break'
        ) {
          return evaluateDependsOn(
            field,
            formData
          )
        }

        let hiddenBySection =
          false

        for (
          let i = index - 1;
          i >= 0;
          i--
        ) {
          const previousField =
            fields[i]

          if (
            previousField.fieldtype ===
            'Section Break'
          ) {
            hiddenBySection =
              !evaluateDependsOn(
                previousField,
                formData
              )

            break
          }
        }

        if (
          hiddenBySection
        ) {
          return false
        }

        // Standard filtering rules for everything else
        return (
          Number(
            field.show_on_app || 0
          ) === 1 &&
          !field.hidden &&
          !HIDDEN_FIELD_TYPES.includes(
            field.fieldtype
          ) &&
          !SYSTEM_FIELDS.includes(
            field.fieldname
          ) &&
          evaluateDependsOn(
            field,
            formData
          ) &&
          !(
            operation ===
              'Equipment Interchange Receipt' &&
            field.fieldtype ===
              'Attach Image'
          )
        )
      }
    ) || []
  )
}