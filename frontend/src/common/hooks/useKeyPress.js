import { useCallback, useEffect } from "react";

const useKeyPress = (key, cb) => {
    const onKeyDown = useCallback(
        (event) => {
            if (event.key === key) {
                cb(event);
            }
        },
        [cb, key]
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);
};

export default useKeyPress;
