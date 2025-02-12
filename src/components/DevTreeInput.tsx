import { Switch } from "@headlessui/react";
import { DevTreeLink } from "../types/user";
import { classNames } from "../utils";

type Props = {
  item: DevTreeLink;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnabledChange: (socialNetwork: string) => void;
};

function DevTreeInput(props: Props) {
  const { item, handleUrlChange, handleEnabledChange } = props;
  return (
    <div className="bg-white shadow-sm p-5 flex items-center gap-3 ">
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
      ></div>

      {/* TODO: ATRIBUTO NAME 
    al pasarle el atributo name obtengo el jombre del campo al que estoy accediendo al input que estoy accediendo 
    por lo que puedo leerlo en el padre por que estoy pasando el e c0ompletamante 

    y en el padre puedo acceder ahora no solo a su valor con e.target.value 
    si noq ue al name del input
    */}
      <input
        type="text"
        value={item.url}
        onChange={(e) => handleUrlChange(e)}
        className="flex-1 border border-gray-300 rounded-lg"
        name={item.name}
      />

      <Switch
        checked={item.enabled}
        onChange={() => handleEnabledChange(item.name)}
        className={classNames(
          item.enabled ? "bg-blue-500" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            item.enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </div>
  );
}

export default DevTreeInput;
