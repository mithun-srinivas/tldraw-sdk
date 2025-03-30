import React from 'react'
import { useParams } from 'react-router'
import WhiteBoard from '../../components/whiteboard/WhiteBoard'

function Collab() {
    const {key} = useParams()
  return (
    <>
        <WhiteBoard persistenceKey={key} isRT={true} />
    </>
  )
}

export default Collab