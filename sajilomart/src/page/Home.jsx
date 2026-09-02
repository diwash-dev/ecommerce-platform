import Filtermenu from '@/components/ui/navbar/Filtermenu'
import FrontDisplay from '@/components/ui/navbar/FrontDisplay'
import { Itemlist } from '@/components/ui/navbar/Itemlist'
import React from 'react'

const Home = () => {

  
  return (
    <div>
   <FrontDisplay />
   <Filtermenu />
   <Itemlist />
    </div>
  )
}

export default Home