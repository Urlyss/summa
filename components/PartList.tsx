import React from 'react'
import ListItem from './ListItem';

const PartList = ({ parts }: { parts: { id: string; title: string }[] }) => {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className="text-3xl text-center">Parts list</h2>
      {parts.map((p,ind) => (
        <ListItem key={ind} item={{title:p.title,href:`/explore/Pt${p.id}`}}/>
      ))}
    </div>
  )
}

export default PartList