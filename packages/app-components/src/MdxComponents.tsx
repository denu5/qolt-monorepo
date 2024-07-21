import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { AspectRatio, Card, Typography } from '@mui/joy'
import { YouTubeEmbed } from '@next/third-parties/google'

type CustomLinkProps = object &
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

const CustomLink: React.FC<CustomLinkProps> = (props) => {
    const href = props.href
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))

    if (isInternalLink) {
        return (
            <Link {...(props as LinkProps)} href={href}>
                <a>{props.children}</a>
            </Link>
        )
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />
}

type YouTubeProps = {
    videoid: string
    params?: string
}

const YouTube = ({ videoid, params = 'controls=0' }: YouTubeProps) => (
    <Card>
        <AspectRatio ratio="16/9" sx={{ 'lite-youtube': { maxWidth: 'unset' } }}>
            <YouTubeEmbed videoid={videoid} params={params} />
        </AspectRatio>
    </Card>
)

const defaultComponents = {
    h1: ({ ...props }) => <Typography level="h1" {...props} />,
    h2: ({ ...props }) => <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }} {...props} />,
    Image: Image,
    Link: CustomLink,
    YouTube: YouTube,
}

type Props = {
    code: string
    components?: object
}

export function Mdx({ code, components: customComponents = {} }: Props) {
    const Component = useMDXComponent(code)
    const combinedComponents = { ...defaultComponents, ...customComponents }

    return (
        <div className="mdx">
            <Component components={combinedComponents} />
        </div>
    )
}
