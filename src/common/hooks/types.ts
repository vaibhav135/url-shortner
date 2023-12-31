export type QueryReturnProps<T> = {
    isLoading: boolean;
    request: () => void;
    refetch: () => void;
} & RequestResult<T>;

export type MutationReturnProps<T> = {
    data: T;
    isLoading: boolean;
    isSuccess: boolean;
    request: (input: RequestInfo | URL, init?: RequestInit) => void;
    reset: () => void;
};

export type RequestResult<T> = {
    isSuccess: boolean;
    isError: boolean;
    error: {
        message: string;
        status: number;
    } | null;
    data: T | null;
};
