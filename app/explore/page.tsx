import ExplorePage from '@/components/ExplorePage'
import { getPartList } from '@/lib/utils'
import React from 'react'

const page = () => {
  const parts = getPartList()
  return (
    <div className="mt-28 lg:px-36">
      <ExplorePage parts={parts}/>
    </div>
  )
}

export default page