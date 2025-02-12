import { useEffect, useState } from "react";
import { social } from "../data/social";
import { DevTreeLink, SocialNetwork, User } from "../types/user";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/devTreeApi";

function LinkTreeView() {
  const queryClient = useQueryClient();
  const [devTreeLinks, setDevTreeLink] = useState<DevTreeLink[]>(social);
  const user: User = queryClient.getQueryData(["user"])!;

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: () => {
      toast.success("Actualizado Correctamente");
    },
  });

  useEffect(() => {
    // console.log(devTreeLinks);

    //TODO: DATA DESDE BD DEVTREELINKS

    // esto es para poder poner en el state la data de bd

    // CREO UNA CONSTANTE LLAMADA UPDATEDATA

    // DIGO QUE ES IGUAL AL MAPEO DEL STATE QUE SE LLAMA DEVTREELINKS

    // EN EL PROCESO DEL MAP TOMO CADA ITEM Y POR CADA ITEM

    // CREO UNA COSNTANTE LLAMADA USERLINK QUE ES IGUAL A LA BUSQUEDA DE LOS USER LOINKS DE BD PARSEADOS A JSON

    // POR QUE VIENEN COMO STRING ASI "[{ ... , ... ,}]" ENTONCES HAGO UN .FIND

    // PARA BUSCAR EL LINK.NAME ( DATA BD ) QUE SEA IGUAL A ITEM.NAME ( DATA STATE INICIAL )

    // SI ENCUENTRO Y HAY USERLINK RETORNO EL RESTO DEL ITEM Y SETEO URL Y ENABLED CON LA DATA DE BD

    // POR QUE USERLINK REPRESENTA LA DATA DE BD Y LA COMPARAMOS CON EL STATE Y SETEAMOS EL STATE CON LA DATA DE BD

    // SI NO ENCONTRAMOS RETORNAMOS ITEM LO QUE PERMITE QUE TODOS LOS DEMAS ITEMS SE MUESTREN EN EL STATE

    // AUNQUE NO HAYAN SIDO ACTUALIZADOS NI TENGAN CAMBIOS O SI DA IGUAL

    // LUEGO SETEO EL STATE CON LA NUEVA DATA COMPARADA Y ACTUALIZADA CON LA BD

    // POR ESO USAMOS UN USEEFFECT

    const updateData = devTreeLinks.map((item) => {
      const userLink: DevTreeLink = JSON.parse(user.links).find(
        (link: DevTreeLink) => link.name === item.name
      );

      if (userLink) {
        return {
          ...item,
          url: userLink.url,
          enabled: userLink.enabled,
        };
      }

      return item;
    });

    setDevTreeLink(updateData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: ATRIBUTO NAME OINPUT
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("escribiendo", e.target.value);
    // console.log("name", e.target.name);

    // TODO: USO ATRIBUTO NAME

    // COMO ESTOY USANDO EL NAME TRAYENDOLO DESDE EL HIJO

    // PUEDO ACCEDER A EL Y PREGUNTAR SI ES IGUAL AL LINK.NAME QUE EXISTE EN EL

    // STATE INICIAL SI ES ASI COPIA UN LINK TRAE SU DATA PERO ESCRIBE EN URL LA URL INGRESADA

    // EN EL INPUT
    const updateLinks = devTreeLinks.map((link) =>
      link.name === e.target.name
        ? {
            ...link,
            url: e.target.value,
          }
        : link
    );

    setDevTreeLink(updateLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);

  // TODO: STATE LINKS

  // SENCILLAMENTE PASO LAS FUNCIONES AL HIJO

  // EL JHIJO RECIBE COMO PARAMETROE EL ITEM.NAME DE CADA LINK RECORRIDO

  // ACA COMPARO SI ES IGUAL EL NAME TOMO EL CAMPO ENABLED Y DIGO QUE ES IGUAL A SU CONTRARIO

  // POR ESO CAMBIA DE VERDADERO A FALSO O DE FALSO A VERDADERO EL SWITCH

  // PERO MANTEN LAS DEMAS PROPIEDADES INTACTAS

  // SI NO ES IGUAL EL NAME QUE LLEGA DE LA FUNCION AL LINK.NAME DEJA EL LINK

  // Y ESA COMPARATIVSA PASO AL STATE NUEVAMENTEPOR ESO SE ACTUALIZAN O SE CAMBIA LA URL

  // COMO EN LA FUNCION DE ARRIBA , SE CAMBIA LA URL

  const handleEnabledLink = (socialNetwork: string) => {
    // console.log("habilitar deshabilitar", socialNetwork);

    const updateLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("Debe ser una URL válida");
        }
      }
      return link;
    });

    setDevTreeLink(updateLinks);

    let updatedItems: SocialNetwork[] = [];

    // console.log("updateLinks", updateLinks);

    // TODO: SETQUERYDATA

    // debo actualziar los links del usuario y el mutate recibe el user
    // que es lo que recibe el uypdateProfile para actualizar
    // por lo que uso setquerydata en donde tomo el user tomo la data previa
    // la paso como copia y tomo los links y tomo la data actualizada de updatelinks
    // que ya tiene los links actualizados

    // TODO: GUARDAR CACHE ANTES DE GUARDAR EN BD

    // escribir en el cache del usuario
    // luego el mutate toma el objeto solamente y ya

    const selectedSocialNetwork = updateLinks.find(
      (link) => link.name === socialNetwork
    );

    // TODO: HABILITAR DESHABILITAR PARA DAR O QUITAR ID

    // si habilita le asginamos un id

    // si esta deshabilitando loq uitamos del arreglo
    if (selectedSocialNetwork?.enabled) {
      // console.log("habilitando ->", selectedSocialNetwork);
      // console.log("links ->", links.length);

      // TODO: ASIGNAR ID A ELEMENTO QUE VUELVE A HABILITARSE

      // EN CASO DE QUE SE HABILITE Y VUELVA A HABILITARSE
      // EL ID SERA EL FILTRADO DE TODOS LOS LEMENTOS CUYO ID SEA MAYOR A 0 CUENTALOS CON .LENGHT Y SUMALE 1
      const id = links.filter((link) => link.id > 0).length + 1;

      // TODO: SOME() POREGUNTA SI AL MENOS UN ELEMENTO CUMPLE CON LA CONDICION
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id: id,
            };
          } else {
            return link;
          }
        });
        // console.log("ya existe");
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id: id,
        };
        updatedItems = [...links, newItem];
      }
    } else {
      // console.log("deshbabilitando ->", selectedSocialNetwork);

      // TODO: SI DESAHBILITA OBTENER LA POSIOCION
      const indexToUpdate = links.findIndex(
        (link) => link.name === socialNetwork
      );

      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false,
          };
        } else if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) {
          return {
            ...link,
            id: link.id - 1,
          };
        } else {
          return link;
        }
      });

      // CASO DE USO Y EXPLICACION DEL CODIGO

      // COMO ESTOY OBTENIENDO EL INDICE LO USO ACA

      // PRIMERO PREGUNTO SI SON IGUALES LOS NOMBRES

      // SEGUNDO PREGUNTO SI ALGUNOS DE LOS LINK.ID EN CADA ITERACION ES MAYOR AL INDICE DEL ELEMENTO A QUITAR

      // POR EJEM SI TENGO IDS 1 2 3 Y QUITO EL 1 ME QUEDA 2 Y 3

      // PREGUNTO CADA LINK.ID DE LOS QUE QUEDA QUE SON 2 Y 3 SON MAYORES AL INDICE DEL ELEMENTO ELIMINADO ?

      // EN ESTE CASO SI POR QUE ELIMINE EL PRIMER ELEMENTO CUYO INDICE ES 0

      // POR LO TANTO ENTRA A LA CONDICION Y LE RESTA 1 POR LOQ UE 2 Y 3 PASAN A SER 1 Y 2

      // EN OTRO CASO SI TUVIERA NUDEVAMENT 1 2 Y 3

      // Y QUIERO QUITAR EL 2  VUELVO A PREGUNTAR

      // CADA LINK.ID DE LOS RESTANTES OSAE 1 Y 3 ES ALGUNO MAYOR A 1 QUE FUE EL INDICE DEL ELEMENTO A QUITAR ?

      // Y EN EL CASO DEL LINK.ID 1 NO LO ES , POR QUE SON IGUALES EL LINK.ID Y EL INDICE OBTENIDO ,

      // LUEGO LO MISMO PARA EL 3 ES MAYOR A 1 ?

      // EN ESTE CASO SI Y LO PASA A 2

      console.log("posicion de leemnto a deshabilitar", indexToUpdate);
    }

    console.log("updateitems -->>", updatedItems);

    // console.log('selectedSocialNetworl -> ',selectedSocialNetwork );

    // finalmente la actualizacion de links en el cache es segun lo que habilite
    // osea lo que se guarda en updateItems
    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems),
      };
    });
  };

  return (
    <div className="space-y-5">
      {devTreeLinks.map((item) => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnabledChange={handleEnabledLink}
        />
      ))}

      <button
        onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        className="bg-cyan-400 text-lg font-bold p-2 w-full rounded-lg"
      >
        GUARDAR CAMBIOS
      </button>
    </div>
  );
}

export default LinkTreeView;
