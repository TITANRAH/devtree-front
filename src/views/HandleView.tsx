import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getUserByHandle } from "../api/devTreeApi";
import HandleData from "../components/HandleData";

function HandleView() {
  const params = useParams();
  const handle = params.handle!;
  console.log("params -> ", handle);

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle],
    retry: 1,
  });

  console.log(isLoading);
  console.log(error);
  console.log(data);

  if (isLoading) return "Cargando...";

  
  if (error) return <Navigate to={"/404"} />;

  if (data && !error) return <HandleData data={data}/>;
}

export default HandleView;
