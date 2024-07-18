import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import Logout from "./Logout";

const Header = () => {
  const { isLoggedIn, currentUser } = useAppContext();
  return (
    <div className="w-full shadow-xl bg-gradient-to-r from-[#DB504A] to-[#FF6F59]">
      <div className="flex justify-between mx-14 py-6 items-center">
        <Link
          to={"/"}
          className="text-white font-bold text-3xl transition ease-in-out hover:scale-110 hover:-translate-y-1 delay-150"
        >
          iFMS
        </Link>

        {currentUser && isLoggedIn ? (
          <>
            <div className="flex gap-10 items-center">
              {currentUser.isStatesHandler ? (
                <Link
                  to={"/requirement-approval"}
                  className="text-white text-md transition ease-in-out hover:-translate-y-1 delay-150"
                >
                  Approve Requirements
                </Link>
              ) : (
                <>
                  <Link
                    to={"/view-finalized"}
                    className="text-white text-md transition ease-in-out hover:scale-110 delay-150 hover:-translate-y-1"
                  >
                    Finalized
                  </Link>
                  <Link
                    to={"/view-details"}
                    className="text-white text-md transition ease-in-out hover:scale-110 delay-150 hover:-translate-y-1"
                  >
                    View Details
                  </Link>
                </>
              )}

              <Logout />
            </div>
          </>
        ) : (
          <div className="gap-1 flex justify-between items-center bg-white rounded-lg transition ease-in-out hover:scale-110 delay-150 px-1">
            <FiLogIn size={25} className="text-[#FF6F59]" />
            <Link to={"/sign-in"} className="text-[#FF6F59] text-lg px-2 py-2 ">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
