import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";

import { AdminLayout } from "../component/index";

import Dashboard from "../pages/dashboard/Dashboard";

import ProductList from "../pages/products/ProductList";
import Product from "../pages/products/Product";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";

import CustomerList from "../pages/customers/CustomerList";
import AddCustomer from "../pages/customers/AddCustomer";
import EditCustomer from "../pages/customers/EditCustomer";

import BookingList from "../pages/bookings/BookingList";
import BookingDetails from "../pages/bookings/BookingDetails";
import AddBooking from "../pages/bookings/AddBooking";
import EditBooking from "../pages/bookings/EditBooking";

import PaymentList from "../pages/payments/PaymentList";

export default function AppRoutes() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AdminLayout />}>
                <Route path="" element={<Dashboard />} />

                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<Product />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/:id/edit" element={<EditProduct />} />

                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customers/add" element={<AddCustomer />} />
                <Route path="/customers/:id/edit" element={<EditCustomer />} />

                <Route path="/bookings" element={<BookingList />} />
                <Route path="/bookings/:id" element={<BookingDetails />} />
                <Route path="/bookings/add" element={<AddBooking />} />
                <Route path="/bookings/:id/edit" element={<EditBooking />} />

                <Route path="/payments" element={<PaymentList />} />
            </Route>
        )
    )

  return (
    <RouterProvider router={router} />
  );
}
