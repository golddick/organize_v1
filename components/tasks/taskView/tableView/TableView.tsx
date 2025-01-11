import { Task } from '@prisma/client'
import React from 'react'

interface TableViewProps{
    data?:Task[]
}

export const TableView = ({data}:TableViewProps) => {
    console.log(data)
    if (!data || data.length === 0) {
        return <div>No tasks available.</div>; // Handle no data case
    }
  return (
    <div>
         {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            {/* Render more cells as needed */}
          </tr>
        ))}
    </div>
  )
}

