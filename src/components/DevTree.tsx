import NavigationTabs from "./NavigationTabs";
import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { SocialNetwork, User } from "../types/user";
import { useEffect, useState } from "react";
import DevTreeLink from "./DevTreeLink";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header";

interface Props {
  data: User;
}

function DevTree(props: Props) {
  // TODO: DEVTREE DATA
  // tomamos data del componente padre qe es applayout
  // LA PONEMOS EN UN ESTADO PERO FILTRADA POR LINKS HABILITADOS

  // EN EL USEEFFET PREGUNTAMOS SID ATA CAMBUO PARA SETEAR EL ESTADO NUEVAMENTE Y

  // EJECTURAR EN TIEMPO REAL
  const { data } = props;
  const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(
    JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
  );

  // TODO: REFLEJAR HABILITAR DESHABILITAR EN TIEMPO REAL

  // COMO VIENE LA DATA DESDE EL COMPONENTE PADRE

  // USAMOS USEFFECT PARA QUE CUANDO DATA CAMBIEN CAMBIE MI STATE AUTOMATICAMENTE

  // DATA VIENE DE APPLAYOUT Y ES LA RESPUESTA HTTP

  // PERO AL HACER SWITCH PARA JHBILITAR O DESHABILITAR ESTOY SETEANDO EL CACHE DEL USUARIO

  // POR LO QUE DATA QUE ES USER CAMBIA, USEFFECT LO DETCTA Y CAMBIA TAMBIEN EL RENDERIZADO
  useEffect(() => {
    setEnabledLinks(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    );
  }, [data]);

  // console.log("user dede DevTree component,", data);

  const queryClient = useQueryClient();
  const handleDragEnd = (e: DragEndEvent) => {
    // console.log(e.active);
    // console.log(e.over);

    const { active, over } = e;
    if (over && over.id) {
      const prevIndex = enabledLinks.findIndex((link) => link.id === active.id);
      const newIndex = enabledLinks.findIndex((link) => link.id === over.id);
      const order = arrayMove(enabledLinks, prevIndex, newIndex);

      setEnabledLinks(order);

      const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter(
        (item: SocialNetwork) => !item.enabled
      );
      console.log("disabledLinks ->", disabledLinks);

      // TODO: CONCAT GENERA UN ARREGLO NUEVO
      const links = order.concat(disabledLinks);

      console.log(links);

      queryClient.setQueryData(["user"], (prevData: User) => {
        return {
          ...prevData,
          links: JSON.stringify(links),
        };
      });
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100  min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />

          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil: /{data.handle.toUpperCase()}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-white text-center">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="Imagen Perfil"
                  className="mx-auto max-w-[250px]"
                />
              )}

              <p className="text-center text-lg font-black text-white">
                {data.description}
              </p>

              {/* 
              TODO: DND KIT
              DND CONTECT RODEA LO QUE NECESITA LA FU CIONALIDAD 
              ONDRAGEND ES CUANDO FINALIZA O SULETA EN ESTE CASO EL ENLACE
              ESTA FUNCION ES QUE PASARA CUANDO SOLTEMOS EL ENLACE

              TAMBIEN HAYQ UE ENCERRAR DENTRO DE SORTEABLECONTEXT
              PIDE LOS ELEMENTOS ITEMS QUE HARAN DRAG AND DROP 
              EN ESTGE CASO GRACIAS AL USEFFECT EN LA PARTE SUPERIOR ENVIAMOS AL COMPONENTE 
              SOLO LOS ENLACES HABILITADOS 
              TAMBIEN PIDE EL STRATEGY LA CUAL SERA PARA ORDEN VERTICAL 
              TABIEN TIENE ESTRATEGIA HORIZONTAL 
              LO DEMAS ES EN COMPONENTE DEVTREELINK

              */}
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex flex-col mt-20 gap-5">
                  <SortableContext
                    items={enabledLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enabledLinks.map((link) => (
                      <DevTreeLink key={link.id} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default DevTree;
