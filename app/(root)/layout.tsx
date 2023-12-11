import Auth from '@/components/auth'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import React, { ReactNode } from 'react'
interface Props {
    children: ReactNode
}

const Layout = async ({ children }: Props) => {
    const session: any = await getServerSession(authOptions)


    if (!session) {
        return <div className='container h-screen mx-auto max-w-7xl'><Auth /></div>
    }

    return (
        <div>{children}</div>
    )
}

export default Layout