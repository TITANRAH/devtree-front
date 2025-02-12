import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { RegisterForm } from "../types/user";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../config/axios";

function RegisterView() {
  const location = useLocation();
  const navigate = useNavigate();

  // console.log('location -> desde register view ',location.state.handle);

  // TODO: REACT HOOK FORM VALORES INICIALES
  // valores inciiales del formulario
  // typado en types carpeta
  const initialValues: RegisterForm = {
    name: "",
    email: "",
    // TODO: NULL
    //  EN VEZ DE IR PREGUNTANDO UNO POR UN O PUEDO USAR ?
    // handle: location && location.state && location.state.handle ? location.state.handle : "",
    handle: location?.state?.handle ? location.state.handle : "",
    password: "",
    password_confirmation: "",
  };

  const {
    reset,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const password = watch("password");

  console.log(password);

  const handleRegister = async (formData: RegisterForm) => {
    try {
      const { data } = await api.post("/auth/register", formData);

      console.log("data", data);

      toast.success(data.message);

      reset();

      navigate("/auth/login");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      }

      toast.error("Hubo un error");
    }

    console.log("Desde handle register", formData);
  };

  return (
    <>
      <h1 className="text-4xl  text-white font-bold">Crear Cuenta</h1>

      {/* TODO: LINK  */}

      {/* SI QUISIERA SALIR DE LA APP USO A PERO DENTRO USO LINK */}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">
            Nombre
          </label>
          <input
            {...register("name", {
              required: "El nombre es obligatorio",
            })}
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />

          {errors.name && (
            <ErrorMessage>{errors.name.message as string}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message as string}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-2xl text-slate-500">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario: sin espacios"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("handle", {
              required: "El handle es obligatorio",
            })}
          />

          {errors.handle && (
            <ErrorMessage>{errors.handle.message as string}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "El password es obligatorio",
              minLength: {
                value: 8,
                message: "El password debe ser de mínimo 8 caracteres",
              },
            })}
          />

          {errors.password && (
            <ErrorMessage>{errors.password.message as string}</ErrorMessage>
          )}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label
            htmlFor="password_confirmation"
            className="text-2xl text-slate-500"
          >
            Repetir Password
          </label>
          <input
            id="password-confirmation"
            type="password"
            placeholder="Repetir Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password_confirmation", {
              required: "Los password no son iguales",
              validate: (value) =>
                value === password || "Los passwords no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>
              {errors.password_confirmation.message as string}
            </ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Crear Cuenta"
        />
      </form>

      <nav>
        <Link
          className="text-white text-center mt-10 text-lg block"
          to="/auth/login"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </>
  );
}

export default RegisterView;
