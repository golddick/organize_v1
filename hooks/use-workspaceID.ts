import { useParams } from "next/navigation"

export const useWorkspaceID = () => {
 const params = useParams()
 return params.workspace_id as string
}
  