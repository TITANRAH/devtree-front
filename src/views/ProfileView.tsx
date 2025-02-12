import { useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileForm, User } from "../types/user";
import { updateProfile, uploadImage } from "../api/devTreeApi";
import { toast } from "sonner";

export default function ProfileView() {
  const queryClient = useQueryClient();

  //   TODO: INCREIBLE, NO NECESITO REALIZAR UNA SEGUNDA LLAMADA AL ENDPOINT
  //   COMO YA TIENE UN GET LOS DATOS ESTAN EN CACHE ME PERITE RECUPERARLOS ASI
  //   AL TENER DOS USEQUERY QUE SON GET CON EL MISMO KEY PUEDO ACCEDER AL CACHE

  const data: User = queryClient.getQueryData(["user"])!;

  console.log("data cacheada ->", data);

  //   TODO: PUEDO TIPAR EL USEFORM TAMBIEN CON EL NUEVO TYPE NACIDO DEDE USER
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      handle: data.handle,
      description: data.description,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    // este error viene da la funcion
    onError: (error) => {
      console.log("Hubo un error");
      toast.error(error.message);
    },
    // aca puedo tomar data que es el return de la funcion
    // puedo tomar todo el return de la funcion en este aso es data y es un string
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,

    // este error viene da la funcion
    onError: (error) => {
      toast.error(error.message);
    },
    // aca puedo tomar data que es el return de la funcion
    // puedo tomar todo el return de la funcion en este aso es data y es un string
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["user"], (prevData: User) => {
        // TODO: OPTIMISTA

        // OBTENEMOS LA DATA CACHEADA POR EJEM AL CAMBIAR LA IMAGEN HAY UNA DATA PREVIA O QUIZAS NADA
        // PERO ESA DATA ESTA EN CACHE

        // ENTONCES RETORNAMOS LO CACHEADO MEMNOS LO QUE QUEREMOS QUE SEA AFECTADO POR EL OPTIMISMO
        // EN ESTE CASO ...prevData REPRESENTA A TODO EL OBJETO USER EXCEPTO image por que lo escribo abajo
        // y le paso la data antes que haga la mutacion
        return {
          ...prevData,
          image: data,
        };
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadImageMutation.mutate(e.target.files[0]);
    }
  };

  const handleUserProfileForm = (formData: ProfileForm) => {
    // TODO: REUTILIZACION DE UPDATEPROFILE
    // para reutilizar el updateProfile hice que recibiera un User completo
    // por lo que traje el usuario cacheado
    // pero su descripcion y su handle ( que es los camposq ue esta funcion actualiza )
    // los iguale al form data
    // por lo que ahora puedo enviar el usuario con descriopcion actualizada y handle actualizado
    // esta funcion pide que el formData ( datos a actualiza sean handle y descroption segun el type PropfileForm)
    // pero la funcion actualizadora http pide un User y eso hice 
    // tomo los datos que vienen del form actualizo el user y lo mando completo como pide la funcion actualziadora
    const user: User = queryClient.getQueryData(["user"])!;
    user.description = formData.description;
    user.handle = formData.handle;
    // console.log('user ->', user);

    // console.log("formData ->", formData);
    updateProfileMutation.mutate(user);
  };

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className="text-2xl text-slate-800 text-center">
        Editar Información
      </legend>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="handle o Nombre de Usuario"
          {...register("handle", {
            required: "El nombre del usuario es obligatorio",
          })}
        />

        {errors.handle && <ErrorMessage> {errors.handle.message}</ErrorMessage>}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          {...register("description", {
            required: "La descripción es obligatoria",
          })}
        />

        {errors.description && (
          <ErrorMessage> {errors.description.message}</ErrorMessage>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Imagen:</label>
        <input
          id="image"
          type="file"
          name="handle"
          className="border-none bg-slate-100 rounded-lg p-2"
          accept="image/*"
          onChange={(e) => handleChange(e)}
        />
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Guardar Cambios"
      />
    </form>
  );
}
