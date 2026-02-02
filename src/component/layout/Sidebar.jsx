import { NavLink } from "react-router";

const navItem = "block px-4 py-2 rounded hover:bg-orange-600";
const active = "bg-orange-700 text-white";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">Rental Admin</h1>

      <nav className="space-y-2">
        <NavLink to="/" className={({ isActive }) => `${navItem} ${isActive && active}`}>
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `${navItem} ${isActive && active}`}>
          Products
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `${navItem} ${isActive && active}`}>
          Customers
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => `${navItem} ${isActive && active}`}>
          Bookings
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => `${navItem} ${isActive && active}`}>
          Payments
        </NavLink>
      </nav>
    </aside>
  );
}
