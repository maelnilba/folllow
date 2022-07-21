import { useState, useEffect } from "react";
import {
  Reorder,
  useDragControls,
  useMotionValue,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { nanoid } from "nanoid/non-secure";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faPlusCircle,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

export function useGrabbing(value: MotionValue<number>) {
  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          document.body.style.cursor = "grabbing";
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          document.body.style.cursor = "";
        }
      }
    });
    return () => {
      document.body.style.cursor = "";
    };
  }, [value]);
}

interface DraggableList<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAdd?: (item: T) => void;
  onRemove?: (item: T) => void;
  onReorder?: (items: T[]) => void;
}

type ContainsId<Arg> = Arg extends { id: string } ? Arg : never;

export default function DraggableList<T>(props: DraggableList<ContainsId<T>>) {
  const [list, setList] = useState(props.items);
  const remove = (item: typeof list[number]) => {
    if (props.onRemove instanceof Function) {
      props.onRemove(item);
    }
    setList((l) => l.filter((v) => v.id !== item.id));
  };
  const add = () => {
    const newItem = { id: nanoid() } as typeof list[number];
    if (props.onAdd instanceof Function) {
      props.onAdd(newItem);
    }
    setList([...list, newItem]);
  };

  const reorder = (items: typeof list) => {
    if (props.onReorder instanceof Function) {
      props.onReorder(items);
    }
    setList(items);
  };

  return (
    <div className="flex flex-col p-4">
      <Reorder.Group
        axis="y"
        values={list}
        onReorder={reorder}
        // layoutScroll
        // style={{ overflowY: "scroll" }}
        className="flex w-full flex-col items-center space-y-4 p-6"
      >
        <div className="flex">
          <button
            type="button"
            className="btn btn-ghost gap-2 normal-case"
            onClick={(event) => {
              event.stopPropagation();
              add();
            }}
          >
            <FontAwesomeIcon className="text-2xl" icon={faPlusCircle} />
            New one
          </button>
        </div>

        <AnimatePresence initial={false}>
          {list.map((item, index) => (
            <Item key={item.id} item={item} removeItem={remove}>
              {props.renderItem(item, index)}
            </Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

interface ItemProps<T> {
  item: T;
  children: React.ReactNode;
  removeItem(item: T): void;
}
function Item<T>({ item, children, removeItem }: ItemProps<ContainsId<T>>) {
  const y = useMotionValue(0);
  useGrabbing(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={"" + item.id}
      style={{ y }}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      }}
      className="kard flex w-full flex-row space-x-2 p-6 pr-2"
    >
      <div
        className="mr-4 flex flex-col items-center justify-center"
        onPointerDown={(event) => dragControls.start(event)}
      >
        <FontAwesomeIcon
          icon={faGripLines}
          className="text-2xl hover:cursor-grab active:cursor-grabbing"
        />
      </div>
      <div className="flex flex-grow">{children}</div>
      <div
        className="flex items-center justify-center"
        onClick={(event) => {
          event.stopPropagation();
          removeItem(item);
        }}
      >
        <FontAwesomeIcon
          icon={faSquareXmark}
          className="text-2xl hover:cursor-pointer hover:opacity-50"
        />
      </div>
    </Reorder.Item>
  );
}
