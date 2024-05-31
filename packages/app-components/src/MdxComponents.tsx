import { Typography } from '@mui/joy'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'

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

const components = {
    h1: ({ ...props }) => <Typography level="h1" {...props} />,
    h2: ({ ...props }) => <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }} {...props} />,
    Image: Image,
    Link: CustomLink,
}

type Props = {
    code: string
}

export function Mdx({ code }: Props) {
    const Component = useMDXComponent(code)
    return (
        <div className="mdx">
            <Component components={components} />
        </div>
    )
}
