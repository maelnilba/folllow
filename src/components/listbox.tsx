import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { Craft } from "@prisma/client";
import { crafts } from "@shared/crafts";

interface CraftListboxProps {
  defaultValue?: Craft;
  name: string;
}

export const CraftListbox = (props: CraftListboxProps) => {
  const [selected, setSelected] = useState(props.defaultValue || undefined);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <input type="hidden" value={selected} name={props.name} />
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            {selected || "What's your craft ?"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {crafts.map((craft, craftIdx) => (
              <Listbox.Option
                key={craftIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-6 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={craft}
              >
                {({ selected }) => (
                  <div className="flex flex-row space-x-2">
                    {selected ? (
                      <span className="flex items-center text-amber-600">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    ) : null}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {craft}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
