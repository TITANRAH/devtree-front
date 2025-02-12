
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/devTreeApi";
import DevTree from "../components/DevTree";

export default function AppLayout() {
  // TODO: REACT QUERY DEVTOOLS

  // si las veo y entro y veo stale en naranjo es por que ya esta cacheado
  // da info de cuantas veces usa query key osea la llkamada http
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // console.log("data desde componente applayout", data);

  // console.log("isLoading", isLoading);
  // console.log("isError", isError);
  // console.log("error", error?.message);

  // TODO: ACA PODRIA IR UN SKELETON EN VEZ DE CARGANDO

  if (isLoading) return "...Cargando";

  // TODO: AL HACER LOGOUT VENDRA ACA Y DARA ERROR POR QUE NO PUEDE OBTENER EL USUARIO

  // QUIERE DECIR QUE UNA VEZ HAGA LOGIN ES BUENO OBTENER AL USUARIO EN EL LAYOUT DONDE ESTARA 

  // PARA QUE SI NO ENCUENTRA EJECUTRAR REDIRECCION

  if (isError) return <Navigate to="/auth/login" />;

  // console.log("data ->", data);

  if (data) return <DevTree data={data} />;
}
