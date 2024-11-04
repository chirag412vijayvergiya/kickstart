import Link from "next/link";
import Logo from "./Logo";

function Header() {
  return (
    <header
      className="top-0 sticky border-b border-primary-900 px-8 py-5 z-[1000]"
      style={{
        backgroundImage: `
          radial-gradient(40.87% 69.47% at 85.87% 81.98%, rgba(30, 115, 104, 0.09) 0%, rgba(121, 255, 175, 0) 100%),
          radial-gradient(54.34% 45.76% at 15.8% 19.94%, rgba(0, 0, 204, 0.20) 0%, rgba(69, 3, 255, 0) 100%),
          linear-gradient(to right, #01100F, #01100F)
        `,
      }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />

        <div className="flex gap-4 md:mr-4">
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200">
              Campaign
            </button>
          </Link>

          <Link href="/campaigns/new">
            <button className="bg-green-600 text-white px-4 py-1 rounded-lg shadow hover:bg-green-700 transition duration-200 text-2xl">
              +
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
