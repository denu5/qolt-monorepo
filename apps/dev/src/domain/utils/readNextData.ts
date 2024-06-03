import { JSDOM } from 'jsdom'

type NextData<T = any> = {
    props: T
}

function readNextData<T>(htmlString: string): NextData<T> {
    const dom = new JSDOM(htmlString)
    const scriptElement = dom.window.document.querySelector('#__NEXT_DATA__')

    if (scriptElement && scriptElement.textContent) {
        const data: NextData<T> = JSON.parse(scriptElement.textContent)

        if (data?.props === undefined) {
            throw new Error('No props on __NEXT_DATA__')
        }
        return data
    } else {
        throw new Error('Unable to find or parse the required script tag')
    }
}

export async function fetchNextData<T>(url: string): Promise<NextData<T>> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const resultHtml = await response.text()

    if (resultHtml.indexOf(`__NEXT_DATA__`) === -1) {
        throw new Error(`Invalid body, can't find __NEXT_DATA__ for ${url}`)
    }

    return readNextData<T>(resultHtml)
}
