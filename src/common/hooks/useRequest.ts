'use client';

import { useEffect, useState, useCallback } from 'react';
import { HTTPResponseError } from '../custom-errors';
import { QueryReturnProps, RequestResult, MutationReturnProps } from './types';
import toast from 'react-hot-toast';

const queryResultInitialState: RequestResult<null> = {
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
};

export const useQuery = <T>(
    input: RequestInfo | URL,
    init: RequestInit,
    auto: boolean = true // Incase you want to call the api on demand.
): QueryReturnProps<T> => {
    const [isLoading, setIsLoading] = useState(false);
    const [queryResult, setQueryResult] = useState<RequestResult<T>>(
        queryResultInitialState
    );

    const request = useCallback(async () => {
        return await fetch(input, init)
            .then(async (response) => {
                if (!response.ok) {
                    const errorMessage: string = await response.text();
                    throw new HTTPResponseError(errorMessage, response.status);
                }

                const responseData = await response.json();
                setQueryResult((value) => ({
                    ...value,
                    isSuccess: true,
                    data: responseData.data,
                }));
                toast.success(responseData.message);
            })
            .catch((error: HTTPResponseError) => {
                setQueryResult((value) => ({
                    ...value,
                    isError: true,
                    error: {
                        message: error.message,
                        status: error.status,
                    },
                }));
                toast.error(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [init, input]);

    const refetch = () => {
        setQueryResult(queryResultInitialState);
        request();
    };

    const initialize = () => {
        if (auto) {
            setIsLoading(true);
            request();
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    return { ...queryResult, isLoading, request, refetch };
};

const mutationResultInitialState: RequestResult<null> = {
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
};

export const useMutation = <T>(): MutationReturnProps<T> => {
    const [isLoading, setIsLoading] = useState(false);
    const [mutationResult, setMutationResult] = useState<RequestResult<T>>(
        mutationResultInitialState
    );

    const request = useCallback(
        async (input: RequestInfo | URL, init?: RequestInit) => {
            return await fetch(input, init)
                .then(async (response) => {
                    if (!response.ok) {
                        const errorMessage: string = await response.text();
                        throw new HTTPResponseError(
                            errorMessage,
                            response.status
                        );
                    }

                    const responseData = await response.json();
                    setMutationResult((value) => ({
                        ...value,
                        isSuccess: true,
                        data: responseData.data,
                    }));
                    toast.success(responseData.message);
                })
                .catch((error: HTTPResponseError) => {
                    setMutationResult((value) => ({
                        ...value,
                        isError: true,
                        error: {
                            message: error.message,
                            status: error.status,
                        },
                    }));
                    toast.error(error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        []
    );

    const reset = () => {
        setMutationResult(mutationResultInitialState);
    };

    return { ...mutationResult, isLoading, request, reset };
};
