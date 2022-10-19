import Navbar from '@/components/global/Header'
import Footer from '@/components/global/Footer'

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            {/* <Footer /> */}
        </>
    )
}