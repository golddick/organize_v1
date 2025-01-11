import { useParams } from "next/navigation"

export const useProjectID = () => {
 const params = useParams()
 return params.projectID as string
}
  