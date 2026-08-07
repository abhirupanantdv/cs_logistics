//MainLayout.jsx
import Header from './Navbar'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="p-8">{children}</main>
    </div>
  )
}