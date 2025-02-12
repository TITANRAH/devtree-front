import { Link } from "react-router-dom";

function HomeNavigation() {
  return (
    <>
      <Link
        className="text-white p-2 cursor-pointer "
        to="/auth/login"
      >
        Inicar Sesión
      </Link>
      <Link
        className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
        to="/auth/register"
      >
       Registrarme
      </Link>
    </>
  );
}

export default HomeNavigation;
