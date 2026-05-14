import Navbar from '@/components/Navbar'
import Banner from './banner'
import ProductCarts from '../products/productCards'
import ProductList from '../products/productsLists'


export const Homepage = () => {
    return (
        <>
            <Banner />
            <ProductList/>
        </>
    )
}
