import { Link } from 'react-router-dom'

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        LibManager
                    </span>
                    <div className="flex gap-4">
                        <Link to="/login" className="px-5 py-2 text-gray-600 hover:text-blue-600 font-medium transition">Login</Link>
                        <Link to="/register" className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-100">
                            🚀 Smart Library Management System 2025
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Discover Your Next <br/>
                            <span className="text-blue-600">Great Adventure</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
                            Access thousands of books, track your reading journey, and manage loans effortlessly with our modern platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 text-center">
                                Browse Library
                            </Link>
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition text-center">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                        <img
                            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Library Shelf"
                            className="relative rounded-2xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App