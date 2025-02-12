import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import slugify from "react-slugify";
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "../api/devTreeApi";
import { Link } from "react-router-dom";

function SearchForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      handle: "",
    },
  });
  const handle = watch("handle");

  const mutation = useMutation({
    mutationFn: searchByHandle,
  });

  const handleSearch = () => {
    const slug = slugify(handle);
    mutation.mutate(handle);
    console.log("handle ", slug);
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)} className="space-y-5">
      <div className="relative flex items-center  bg-white  px-2">
        <label htmlFor="handle">devtree.com/</label>
        <input
          type="text"
          id="handle"
          className="border-none bg-transparent p-2 focus:ring-0 flex-1"
          placeholder="elonmusk, zuck, jeffbezos"
          {...register("handle", {
            required: "Un Nombre de Usuario es obligatorio",
          })}
        />
      </div>
      {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

      <div className="mt-10">
        {mutation.isPending && <p className="text-center">Consultando...</p>}
        {mutation.error && (
          <p className="text-center text-red-600 font-black">
            {mutation.error.message}
          </p>
        )}
        {mutation.data && (
          <p className="text-center text-cyan-500 ">
            {" "}
            {mutation.data} ir a{" "}
            {/* TODO: PASAR ESTADOS ENTRE URLS */}
            <Link
              className="font-bold"
              to={"/auth/register"}
              state={{ handle: slugify(handle) }}
            >
              Registro
            </Link>
          </p>
        )}
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Obtener mi DevTree"
      />
    </form>
  );
}

export default SearchForm;
