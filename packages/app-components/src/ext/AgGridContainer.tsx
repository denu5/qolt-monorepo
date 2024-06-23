'use client'

// AgGrid: When using these utils remember to install 'ag-grid-react' in the app
// import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import { useColorScheme } from '@mui/joy'

type AgGridTheme = 'quartz' | 'balham' | 'alpine'

export function useAgGridThemeClass(theme: AgGridTheme = 'quartz') {
    const { mode } = useColorScheme()
    return mode === 'dark' ? `ag-theme-${theme}-dark` : `ag-theme-${theme}`
}

type AgGridContainerProps = {
    theme?: AgGridTheme
    width?: number | string
    height?: number | string
}

export function AgGridContainer({
    children,
    theme = 'quartz',
    width = '100%',
    height = 500,
}: React.PropsWithChildren<AgGridContainerProps>) {
    const themeClass = useAgGridThemeClass(theme)
    return (
        <div className={themeClass} style={{ width, height }}>
            {children}
        </div>
    )
}
