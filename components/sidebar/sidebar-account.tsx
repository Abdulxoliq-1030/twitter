import { signOut } from 'next-auth/react'
import React from 'react'
import { RiLogoutCircleLine } from "react-icons/ri"

const SidebarAccount = () => {
    return (
        <>
            {/* MOBILE SIDEBAR ACCOUNT */}
            <div className="lg:hidden block">
                <div className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer"
                    onClick={() => signOut()}
                >
                    <RiLogoutCircleLine size={24} color="white" />
                </div>
            </div>
        </>
    )
}

export default SidebarAccount