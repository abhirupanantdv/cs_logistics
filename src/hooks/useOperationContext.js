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