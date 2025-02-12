import { SocialNetwork } from "../types/user";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// TODO: DND KIT 2

// LLAMAMOS A UTILITIES Y CSS PARA LOS EFECTOS DE ARRASTRE
// TAMBIEN AUN HOOK USESORTABLE EL CUAL RETORNA MIULTIPLES ATRIBUTOS EN ESTE CASO LE PASAREMOS
// UN ID UNICO Y LO TNEEMOS EN LINK.ID TAMBIEN DEFINE SU ORDEN

// LISTENERS ES LOS EVENTOS DEL MOUSE O DEDO
// SETNODEREF NOS SIRVE PA DETERMINAR A QUE ELEMENTO QUEREMOS USAR DRAG AND DROP
// TRANSOFRM Y TRANSITION SON PARA CSS

interface Props {
  link: SocialNetwork;
}

function DevTreeLink(props: Props) {
  const { link } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: link.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg cursor-pointer"
      {...attributes}
      {...listeners}
    >
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
      ></div>

      <p className="capitalize">
        Vista mi: <span className="font-bold">{link.name}</span>{" "}
      </p>
    </li>
  );
}

export default DevTreeLink;
