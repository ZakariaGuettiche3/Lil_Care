import { cn } from '@/lib/utils'
import React from 'react'

type Props= {
    children : React.ReactNode
    sm? : number,
    md ?: number
    lg?: number
    xl?: number
    className ? : string
}

function Grid({sm, md, lg, xl, children, className}: Props){

    const styles = cn("pt-4 sm:pb-8 lg:p-4 xl:px-8 xl:pb-8 grid  gap-4 text-sm leading-6 dark:bg-slate-900/40 dark:ring-1 dark:ring-white/5",
                         sm ? `sm:grid-cols-${sm}` : "",
                         md ? `sm:grid-cols-${md}` : "",
                         lg ? `sm:grid-cols-${lg}` : "",
                         xl ? `sm:grid-cols-${xl}` : "",
                         className

    )
  return (
    <ul className ={styles}>
        {children}
    </ul>
  )
}

export default Grid