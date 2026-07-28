export async function validateJobCardClosure(
  jobCard
) {
  const errors = []

  for (const container of jobCard.container) {
    const containerNo =
      container.container_number ||
      container.container

    const operations =
      jobCard.operations.filter(
        (op) =>
          op.containers ===
          containerNo
      )

    const gateIn =
      operations.find(
        (op) =>
          op.operation_type ===
          'Gate In'
      )

    const gateOut =
      operations.find(
        (op) =>
          op.operation_type ===
          'Gate Out'
      )

    const salesInvoice =
      operations.find(
        (op) =>
          op.operation_type ===
          'Sales Invoice'
      )

    if (gateIn && !gateOut) {
      errors.push(
        `${containerNo}: Gate Out missing`
      )
    }

    if (
      gateIn &&
      gateOut &&
      !salesInvoice
    ) {
      errors.push(
        `${containerNo}: Sales Invoice missing`
      )
    }

    if (salesInvoice) {
      const invoice =
        await getSalesInvoiceDetails(
          salesInvoice.operation
        )

      if (
        Number(
          invoice.outstanding_amount
        ) > 0
      ) {
        errors.push(
          `${containerNo}: Outstanding invoice amount exists`
        )
      }
    }

    if (gateIn && gateOut) {
      const gateInDate =
        new Date(gateIn.time)

      const gateOutDate =
        new Date(gateOut.time)

      if (
        gateOutDate <
        gateInDate
      ) {
        const gateInDoc =
          await getOperationRecordDetails(
            'Gate In',
            gateIn.operation
          )

        if (
          !gateInDoc.storage_start
        ) {
          errors.push(
            `${containerNo}: Storage Start not set`
          )
        }
      }
    }
  }

  return {
    valid:
      errors.length === 0,
    errors,
  }
}