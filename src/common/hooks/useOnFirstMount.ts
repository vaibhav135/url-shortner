'use client'

import { useRef, useEffect } from 'react'

/*
  Restricts the first default render.
*/
export const useOnFirstMount = () => {
    const onFirstMountRef = useRef(true)
    useEffect(() => {
        onFirstMountRef.current = false
    }, [])
    return onFirstMountRef.current
}
