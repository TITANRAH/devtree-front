import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { LoginForm } from "../types/user";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../config/axios";

function LoginView() {
  const initialValues: LoginForm = {
    email: "",
    password: "",
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const navigate = useNavigate();

  const handleLogin = async (formData: LoginForm) => {
    console.log(formData);
    try {
      const { data } = await api.post("/auth/login", formData);

      localStorage.setItem("AUTH_TOKEN", data.token);
      localStorage.setItem("USER_NAME", data.user.name);
      localStorage.setItem("USER_EMAIL", data.user.email);

      console.log("data", data);

      
      reset();

      navigate('/admin')
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      }

      if (error instanceof Error) {
        console.log("error es innstancia de eerror", error.message);
        toast.error(error.message);
      } else {
        toast.error("Un error desconocido ha ocurrido");
      }
    }

    reset();
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-white">Iniciar Sesión</h1>
      {/* TODO: LINK */}

      {/* SI QUISIERA SALIR DE LA APP USO A PERO DENTRO USO LINK */}

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="px-5 py-20 mt-10 space-y-10 bg-white rounded-lg"
        noValidate
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="w-full p-3 text-lg font-bold uppercase rounded-lg cursor-pointer bg-cyan-400 text-slate-600"
          value="Iniciar Sesión"
        />
      </form>

      <nav className="mt-10">
        <Link
          className="block mt-10 text-lg text-center text-white"
          to="/auth/register"
        >
          ¿No tienes una cuenta? Crea una aquí
        </Link>
      </nav>
    </>
  );
}

export default LoginView;
