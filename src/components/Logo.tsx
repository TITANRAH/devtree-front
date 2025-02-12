import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <img src="/logo.svg" alt="Logotipo DevTree" />
    </Link>
  );
}

export default Logo;
