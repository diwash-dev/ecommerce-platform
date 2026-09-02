import React from 'react'
import Navbar from '../components/ui/navbar/Navbar'
import Footer from '../components/ui/navbar/Footer'

const Root = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />

        </>
    )
}

export default Root