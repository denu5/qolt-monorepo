import AspectRatio, { AspectRatioProps } from '@mui/joy/AspectRatio'

export function MainLogo(props: AspectRatioProps) {
    return (
        <AspectRatio
            ratio="1"
            variant="plain"
            {...props}
            sx={[
                {
                    width: 36,
                    borderRadius: 'sm',
                    color: 'inherit',
                },
            ]}
        >
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                    <path
                        fill="currentColor"
                        d="m187 119-82 47v57l-41-25v-56l122-70 1 47Zm249 23v56l-41 25v-57l-81-46V72l122 70Zm0 160v56l-122 70-1-47 82-47v-57l41 25Zm-250 78v48L64 358v-56l41-25v57l81 46Zm147-82v-96l-83-48-83 48v96l83 48 83-48Z"
                    />
                </svg>
            </div>
        </AspectRatio>
    )
}
