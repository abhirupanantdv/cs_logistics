import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const useOperationContext =
  () => {
    const { id } = useParams()

    const [jobCard, setJobCard] =
      useState(null)

    const [
      selectedContainers,
      setSelectedContainers,
    ] = useState([])

    const [
      containerDetails,
      setContainerDetails,
    ] = useState([])

    
  }