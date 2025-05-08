import Link from "next/link";

const Nav = () => {
  return (
    <nav className="bg-blue-700 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="text-white font-extrabold text-2xl tracking-wide mb-3 sm:mb-0 drop-shadow">
          Getting to Know the Classics | AI Edition
        </div>
        <div className="flex space-x-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg font-bold bg-blue-500 text-white shadow hover:bg-white hover:text-blue-700 border-2 border-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Home
          </Link>
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg font-bold bg-blue-500 text-white shadow hover:bg-white hover:text-blue-700 border-2 border-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
