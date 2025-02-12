import { useQueryClient } from "@tanstack/react-query";

function AdminNavigation() {
  const queryClient = useQueryClient();

  // TODO: ELIMINAR TOKEN DE LOCALSTORAGE

  // Y ELIMINAR CON TANSTACK QUERY EL USER
  const logout = () => {
    console.log("cerrando session");
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("USER_NAME");
      localStorage.removeItem("USER_EMAIL");
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <button
      className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
      onClick={logout}
    >
      Cerrar Sesión
    </button>
  );
}

export default AdminNavigation;
