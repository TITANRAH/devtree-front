import { SocialNetwork, UserHandle } from "../types/user";

interface Props {
  data: UserHandle;
}

function HandleData(props: Props) {
  const { data } = props;

  const links: SocialNetwork[] = JSON.parse(data.links).filter(
    (link: SocialNetwork) => link.enabled
  );

  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.handle}</p>

      {data.image && <img src={data.image} className="max-w-[250px] mx-auto" />}

      <p className="text-lg text-center font-bold">{data.description}</p>
      {/* TODO: GAP SOLO FUNCIONA CON FLEX SI NO USAR SPACE-Y-6 */}
      <div className="mt-20 flex flex-col gap-6">
        {links.length ? (
          links.map((link: SocialNetwork) => (
            // TODO: PORQUE a Y NO Link de react router dom
            // por que a dirije a navegacion externa y Link navegacion interna
            <a
              className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={`/social/icon_${link.name}.svg`} alt="imagen red social" className="w-12"/>
              <p className="text-black capitalize font-bold text-lg">
                Visita mi: {link.name}
              </p>
            </a>
          ))
        ) : (
          <p className="text-center">No hay enlaces en este perfil</p>
        )}
      </div>
    </div>
  );
}

export default HandleData;
