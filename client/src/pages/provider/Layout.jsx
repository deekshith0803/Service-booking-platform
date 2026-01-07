import React, { useEffect } from 'react'
import NavbarProvider from '../../components/provider/NavbarProvider'
import SideBar from '../../components/provider/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

    const { isProvider, navigate } = useAppContext();

    useEffect(() => {
        if (!isProvider) {
            navigate('/');
        }
    }, [isProvider])

    // This component serves as a layout for the provider pages
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarProvider />
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
