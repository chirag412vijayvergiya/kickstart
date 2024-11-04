import Link from "next/link";
import Logo from "./Logo";
import { MdEmail, MdPhone } from "react-icons/md";
// import { socialLinks } from "../_lib/constants";
import Image from "next/image";
function Aboutme() {
  return (
    // <footer className="flex flex-col mx-auto w-full gap-y-7 py-6">
    <footer className="relative flex flex-col mx-auto w-full gap-y-7 py-6 overflow-hidden  text-white">
      <div
        className="bubble bubble-small"
        style={{ top: "20%", left: "15%" }}
      ></div>
      <div
        className="bubble bubble-medium"
        style={{ top: "50%", left: "30%" }}
      ></div>
      <div
        className="bubble bubble-large"
        style={{ top: "70%", left: "80%" }}
      ></div>
      <div
        className="bubble bubble-small"
        style={{ top: "40%", left: "60%" }}
      ></div>
      <div
        className="bubble bubble-medium"
        style={{ top: "60%", left: "40%" }}
      ></div>
      <div className="flex flex-col items-center gap-x-24 gap-y-12 md:flex-row md:items-start md:justify-around md:gap-0">
        <div className="flex flex-col items-center gap-y-3 px-4 text-center sm:items-start md:text-start">
          <Logo type="footer" />
          <p className="text-md max-w-[300px] font-normal text-neutral-400">
            Crowdfunding platform for everyone
          </p>
        </div>
        {/* <div className="flex flex-col gap-y-3 text-center text-base md:text-left"></div> */}
        <div className="flex flex-col gap-y-3 text-center text-base md:text-left justify-center">
          <p className="text-center font-medium md:text-center text-indigo-500">
            Get In Touch
          </p>
          <div className="group flex flex-col items-center gap-3">
            <div className="flex flex-row gap-x-2 items-center hover:text-indigo-300">
              <MdEmail className="fill-shark-300 h-5 w-5" />
              <p className="text-shark-300 font-medium">chirag4vv@gmail.com</p>
            </div>
            <div className="flex flex-row gap-x-2 items-center hover:text-indigo-300">
              <MdPhone className="fill-shark-300 h-5 w-5 " />
              <p className="text-shark-300 font-medium tracking-wider">
                +91 7737012653
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-base text-accent-400 mx-4 md:mx-0">
        Copyright &#169; 2024 || Chirag Vijayvergiya All Right Reserved.
      </div>
    </footer>
  );
}

export default Aboutme;
