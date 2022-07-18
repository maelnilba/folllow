import { AnimatePresence, motion } from "framer-motion";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

interface ToastOptions {
  position: "tr" | "tl" | "br" | "bl";
  duration: number;
  transition: {
    duration: number;
  };
}

interface ToastProps {
  options: ToastOptions;
  children: React.ReactNode;
}

export interface ToastElement {
  show(): void;
  hide(): void;
}

export const Toast = memo(
  forwardRef<ToastElement, ToastProps>((props, ref) => {
    const [show, setShow] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const [id, increment] = useReducer((state) => state + 1, 1);

    useImperativeHandle(ref, () => ({
      show() {
        if (show === false) {
          setShow(true);
          timer.current = setTimeout(() => {
            setShow(false);
          }, props.options.duration);
        } else {
          increment();
        }
      },
      hide() {
        if (show === true) {
          setShow(false);
          if (timer.current) {
            clearTimeout(timer.current);
          }
        }
      },
    }));

    useEffect(() => {
      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    }, []);

    const position = useMemo(
      () =>
        [
          props.options.position.includes("t") ? "top-0" : "bottom-0",
          props.options.position.includes("r") ? "right-0" : "left-0",
        ].join(" "),
      [props.options.position]
    );

    return (
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            key={id}
            transition={{
              duration: props.options.transition.duration,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed ${position} p-2`}
          >
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  })
);
