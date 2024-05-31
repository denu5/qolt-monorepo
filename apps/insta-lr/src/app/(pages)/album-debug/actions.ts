'use server'

import { getSharesConfig } from 'domain/lib/lightroom-api'
import { JSDOM, VirtualConsole } from 'jsdom'

type WindowVariables = {
    SharesConfig?: any
}

function readWindowVars(htmlString: string): WindowVariables {
    const windowVars: WindowVariables = {}
    const virtualConsole = new VirtualConsole()
    virtualConsole.on('error', (message) => {
        console.error('Console error:', message)
    })

    const dom = new JSDOM(htmlString, { runScripts: 'dangerously', virtualConsole })

    virtualConsole.on('log', (message) => {
        Object.assign(windowVars, JSON.parse(message))
    })

    dom.window.eval(`
      (function() {
        const capturedVars = {
          SharesConfig: window.SharesConfig,
        };
        console.log(JSON.stringify(capturedVars));
      })();
    `)

    return windowVars
}

export async function fetchData(url: string) {
    if (!/^https:\/\/adobe\.ly\/.+$/.test(url)) {
        throw new Error('Invalid URL. Please enter a valid adobe.ly URL.')
    }

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const resultHtml = await response.text()

    if (resultHtml.indexOf(`spaceAttributes: {"base":"https://photos.adobe.io/v2/"`) === -1) {
        throw new Error(`Invalid body, cant read SharesConfig for ${url}`)
    }

    return getSharesConfig(readWindowVars(resultHtml).SharesConfig)
}
