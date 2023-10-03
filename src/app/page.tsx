'use client'

import Link from 'next/link'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { Menubar, MenubarMenu } from '@/components/ui/menubar'

export default function Page() {
    const { setTheme, theme } = useTheme()
    const { status } = useSession()

    return (
        <Menubar className="p-5">
            <MenubarMenu>
                <NavigationMenu>
                    <NavigationMenuList className="">
                        {status === 'authenticated' ? (
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        SignOut
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ) : (
                            <>
                                <NavigationMenuItem>
                                    <Link
                                        href="/signup"
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavigationMenuLink
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            SignUp
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        href="/signin"
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavigationMenuLink
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            SignIn
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>{' '}
                            </>
                        )}
                        <NavigationMenuItem>
                            <Link
                                href="https://github.com/vaibhav135/url-shortner"
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    target="_blank"
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Github
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>

                    <NavigationMenuList>
                        <NavigationMenuItem>
                            {theme === 'dark' ? (
                                <Sun onClick={() => setTheme('light')} />
                            ) : (
                                <Moon onClick={() => setTheme('dark')} />
                            )}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </MenubarMenu>
        </Menubar>
    )
}
