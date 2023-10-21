'use client';

import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut, useSession } from 'next-auth/react';
import { Menubar, MenubarMenu } from './ui/menubar';
import { useOnFirstMount } from '@/common/hooks';

export const NavigationBar = () => {
    // State.
    const hasFirstMount = useOnFirstMount();

    const { setTheme, theme } = useTheme();
    const { status } = useSession();

    return (
        <Menubar className="p-5">
            <MenubarMenu>
                <NavigationMenu className="gap-x-16">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        {status === 'authenticated' ? (
                            <NavigationMenuItem>
                                <Link
                                    href="/my-short-urls"
                                    legacyBehavior
                                    passHref
                                >
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        My Short Urls
                                    </NavigationMenuLink>
                                </Link>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        onClick={() => signOut()}
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

                    <NavigationMenuList className="cursor-pointer">
                        {hasFirstMount && (
                            <NavigationMenuItem>
                                {theme === 'dark' ? (
                                    <Sun
                                        className="fill-yellow-300 stroke-yellow-300 hover:stroke-yellow-500"
                                        onClick={() => setTheme('light')}
                                    />
                                ) : (
                                    <Moon
                                        className="fill-gray-200 stroke-gray-400 hover:fill-gray-300 hover:stroke-gray-500"
                                        onClick={() => setTheme('dark')}
                                    />
                                )}
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </MenubarMenu>
        </Menubar>
    );
};
