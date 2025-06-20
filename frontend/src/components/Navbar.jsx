import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">Prospect Management</div>
            <div className="space-x-4">
                <a href="/" className="text-gray-300 hover:text-white">Home</a>
                <a href="/api/prospects" className="text-gray-300 hover:text-white">Prospects</a>
            </div>
            </div>
        </nav>      
    </div>
  )
}

export default Navbar
