'use client'
import { ScissorsLineDashed } from 'lucide-react'
import { Button, Input } from './ui'

const InputURL = () => {
    return (
        <div className="flex w-full items-center justify-center  space-x-2">
            <Input type="text" placeholder="Enter your long URL here.." />
            <Button type="submit" className="gap-2">
                <ScissorsLineDashed /> <span> Shorten </span>
            </Button>
        </div>
    )
}

export const HomePage = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center  ">
            <h1> Shorty Url - The Fast and Reliable URL Shortener </h1>
            <InputURL />
        </div>
    )
}
