'use client'

import { useQuery } from '@/common/hooks'
import { notFound, redirect } from 'next/navigation'
import { useEffect } from 'react'

type UrlRedirectResponseData = {
    shortUrl: string
    longUrl: string
}

const UrlRedirectPage = ({ params }: { params: { url: string } }) => {
    const { url } = params

    const { isError, error, isSuccess, data } =
        useQuery<UrlRedirectResponseData>(`api/redirect/${url}`, {
            method: 'GET',
        })

    useEffect(() => {
        if (isSuccess && data) {
            redirect(data.longUrl)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (isError && error && error.status === 404) {
            notFound()
        }
    }, [isError, error])
}

export default UrlRedirectPage
