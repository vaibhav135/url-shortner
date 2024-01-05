'use client';

import { useRef, useEffect } from 'react';

/*
  Restricts the first default render.
*/
export const useOnFirstMount = () => {
    const onFirstMountRef = useRef(false);

    useEffect(() => {
        onFirstMountRef.current = true;
    }, []);

    return onFirstMountRef.current;
};
