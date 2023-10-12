'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/ui'
import { HTTPResponseError } from '../custom-errors'
import { QueryReturnProps, RequestResult, MutationReturnProps } from './types'

export const useQuery = <T>(
    input: RequestInfo | URL,
    init: RequestInit,
    auto: boolean = true
): QueryReturnProps<T> => {
    const [isLoading, setIsLoading] = useState(false)
    const [requestResult, setRequestResult] = useState<RequestResult<T>>({
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
    })
    const { toast } = useToast()

    const request = useCallback(async () => {
        return await fetch(input, init)
            .then(async (response) => {
                if (!response.ok) {
                    const errorMessage: string = await response.text()
                    throw new HTTPResponseError(errorMessage, response.status)
                }

                const responseData = await response.json()
                console.log('SOMETHING IS HAPPENING....')
                console.info({ responseData })
                setRequestResult((value) => ({
                    ...value,
                    isSuccess: true,
                    data: responseData.data,
                }))
                toast({
                    description: responseData.message,
                })
            })
            .catch((error: HTTPResponseError) => {
                setRequestResult((value) => ({
                    ...value,
                    isError: true,
                    error: {
                        message: error.message,
                        status: error.status,
                    },
                }))
                toast({
                    variant: 'destructive',
                    description: error.message,
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [init, input, toast])

    const initialize = () => {
        if (auto) {
            setIsLoading(true)
            request()
        }
    }

    useEffect(() => {
        console.info('USE EFFECT.....')
        initialize()
    }, [])

    return { ...requestResult, isLoading, request }
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
