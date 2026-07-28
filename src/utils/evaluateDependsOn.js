//utils/evaluateDependsOn.js

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

      const evalDoc = {
        docstatus: 0,
        ...formData,
      }

      return !!fn(evalDoc)
    } catch (err) {
      console.error(err)
      return true
    }
  }

  return true
}


export const evaluateDependsOn = (
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