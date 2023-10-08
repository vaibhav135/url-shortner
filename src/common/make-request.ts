'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/ui'

type QueryProps = {
    input: RequestInfo | URL
    init?: RequestInit
    auto?: boolean
}

type QueryReturnProps = {
    isLoading: boolean
    isSuccess: boolean
    request: () => void
}

type MutationReturnProps = {
    isLoading: boolean
    isSuccess: boolean
    request: (input: RequestInfo | URL, init?: RequestInit) => void
}

export const useQuery = ({
    input,
    init,
    auto = true,
}: QueryProps): QueryReturnProps => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { toast } = useToast()

    const request = useCallback(async () => {
        return await fetch(input, init)
            .then((result) => {
                console.info({ result })
                toast({
                    variant: 'destructive',
                    description: result.text(),
                })
                setIsSuccess(true)
            })
            .catch((error: Error) => {
                toast({
                    variant: 'destructive',
                    description: error.message,
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [init, input, toast])

    useEffect(() => {
        if (auto) {
            setIsLoading(true)
            request()
        }
    }, [auto, request])

    return { isLoading, isSuccess, request }
}

export const useMutation = (): MutationReturnProps => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { toast } = useToast()

    const request = useCallback(
        async (input: RequestInfo | URL, init?: RequestInit) => {
            return await fetch(input, init)
                .then((result) => {
                    console.info({ result })
                    toast({
                        description: result.text(),
                    })
                    setIsSuccess(true)
                })
                .catch((error: Error) => {
                    toast({
                        variant: 'destructive',
                        description: error.message,
                    })
                })
                .finally(() => {
                    setIsLoading(false)
                })
        },
        [toast]
    )

    return { isLoading, isSuccess, request }
}
