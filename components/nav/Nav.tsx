import Link from "next/link";

const Nav = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="text-white font-bold text-xl mb-2 sm:mb-0">
          Getting to Know the Classics | AI Edition
        </div>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="text-white hover:text-blue-200 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/upload"
            className="text-white hover:text-blue-200 transition-colors"
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
