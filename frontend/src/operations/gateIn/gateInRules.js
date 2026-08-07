// gateInRules.js

export const gateInRules = {
  shouldShowStorageStart: (
    containers
  ) => {
    return containers.some(
      (container) =>
        container.startsWith(
          'CSL'
        )
    )
  },
}