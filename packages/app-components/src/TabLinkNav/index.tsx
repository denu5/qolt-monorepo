'use client'

import { Tab, tabClasses, TabList, Tabs } from '@mui/joy'
import { usePathname } from 'next/navigation'

import { NLink } from '../NLink'

type Props = {
    tabs: { href: string; label: string }[]
}
export function TabLinkNav({ tabs = [] }: Props) {
    const pathname = usePathname()
    return (
        <Tabs defaultValue={pathname} sx={{ bgcolor: 'transparent' }}>
            <TabList
                tabFlex={1}
                size="sm"
                sx={{
                    pb: '6px',
                    [`&& .${tabClasses.root}`]: {
                        flex: 'initial',
                        bgcolor: 'transparent',
                        lineHeight: 1,
                        [`&.${tabClasses.selected}`]: {
                            fontWeight: '600',
                            '&::after': {
                                height: '2px',
                                bgcolor: 'primary.500',
                                bottom: '-6px', // offset pb from above
                            },
                        },
                    },
                }}
            >
                {tabs.map((t) => (
                    <Tab
                        key={t.href}
                        value={t.href}
                        href={t.href}
                        component={NLink}
                        sx={{ borderRadius: '6px' }}
                        indicatorInset
                    >
                        {t.label}
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    )
}
