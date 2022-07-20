import { Fragment, useCallback, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  SocialMediasComponents,
  SocialMediasType,
} from "./social-medias-components";
import { SocialMedia } from "utils/shared";

interface SocialMediaComboboxProps {
  name: string;
  defaultValue?: SocialMedia;
  onChange?: (selected: SocialMediasType[number]) => void;
}

export function SocialMediaCombobox(props: SocialMediaComboboxProps) {
  const [selected, setSelected] = useState<SocialMediasType[number]>(
    SocialMediasComponents.find(
      (socialMedia) => socialMedia.handle === props.defaultValue
    ) || SocialMediasComponents[0]!
  );

  const [query, setQuery] = useState("");

  const filteredMedias = useMemo(
    () =>
      query === ""
        ? SocialMediasComponents
        : SocialMediasComponents.filter((socialMedia) =>
            socialMedia.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          ),
    [query, SocialMediasComponents]
  );

  const handleOnChange = (value: typeof selected) => {
    if (props.onChange instanceof Function) {
      props.onChange(value);
    }
    setSelected(value);
  };

  return (
    <div className="relative top-0  w-full p-1">
      <input type="hidden" value={selected.handle} name={props.name} />
      <Combobox value={selected} onChange={handleOnChange}>
        <div className="relative">
          <div className="relative w-full cursor-default rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-base-content focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="input input-bordered w-full"
              displayValue={(media: SocialMediasType[number]) => media?.name}
              placeholder="Social media"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FontAwesomeIcon
                icon={faCaretDown}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredMedias.length === 0 && query !== "" ? (
                <div className="relative cursor-default py-2 px-4 ">
                  Nothing found.
                </div>
              ) : (
                filteredMedias.map((media) => (
                  <Combobox.Option
                    key={media.handle}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        active ? "bg-base-300" : ""
                      }`
                    }
                    value={media}
                  >
                    {({ selected }) => (
                      <div className="flex-rows flex items-center justify-between space-x-2">
                        <FontAwesomeIcon
                          icon={media.icon}
                          className="flex items-center justify-center"
                        />
                        <span
                          className={`block truncate ${
                            selected ? "font-bold" : "font-normal"
                          }`}
                        >
                          {media.name}
                        </span>
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
