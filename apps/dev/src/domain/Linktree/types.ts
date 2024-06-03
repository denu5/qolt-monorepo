export interface LinktreeAccount {
    id: number
    uuid: string
    username: string
    isActive: boolean
    profilePictureUrl: string
    avatarMode: string
    backgroundHeroColor: string
    pageTitle: string
    googleAnalyticsId: string | null
    facebookPixelId: string | null
    tiktokPixelId: string | null
    donationsActive: boolean
    causeBanner: string | null
    contentWarning: string | null
    description: string
    isLogoVisible: boolean
    socialLinksPosition: string
    useSignupLink: boolean
    createdAt: number
    updatedAt: number
    expandableLinkCaret: boolean
    defaultProfilePage: string
    verticals: string[]
    customAvatar: string
    customAvatarAttributes: any | null
    backgroundImageAttributes: any | null
    profileBadges: any | null
    isVenmoEnabled: boolean
    isSquareWalletEnabled: boolean
    isCookieBannerEnabled: boolean
    isInitialsProfileEnabled: boolean
    isWhatsappNotificationsEnabled: boolean
    isShareLinksEnabled: boolean
    isOnlyfansSEOEnabled: boolean
    isShareWithEllipsis: boolean
    linkTypesForSEO: any | null
    manualTitleTag: any | null
    dynamicMetaTitle: string
    dynamicMetaDescription: string
    enableDynamicProfilePageMetadata: boolean
    linkPlatforms: string[]
    activeGates: any[]
    isAmazonAffiliateEnabled: boolean
    profileLinkContentDisplayType: string
    complementaryThemeProperties: boolean
    timezone: string
    profileDirectoryVerticalUrl: string
    groupsEnabled: boolean
    showSignupOption: boolean
    footerCtaButton: string
    isSnapchatSocialShareEnabled: boolean
    isReportLinktreeEnabled: boolean
    getDynamicMetaTitleVariation: number
    isVisualLinkPreviewsEnabled: boolean
    isShareLinkPreviewEnabled: boolean
    isShareLinkPreviewVScraperEnabled: boolean
    isStoreTabEnabled: boolean
    isProfilePreviewsLinkAppsEnabled: boolean
    isFetchCoMoFromLinktreeBackendEnabled: boolean
    canAccessMonetizationTab: boolean
    eligibleForMonetization: string
    affiliateTokens: any[]
    ownedBy: {
        id: number
        uuid: string
        isEmailVerified: boolean
    }
    pageMeta: any | null
    integrations: any[]
    links: LinktreeLinkEntry[]
    socialLinks: any[]
    theme: Theme
    themeV2: ThemeV2
}

export interface LinktreeLinkEntry {
    id: number
    type: string
    title: string
    position: number
    url: string
    shouldRouteToProfile: boolean
    modifiers?: Partial<Modifiers>
    context?: Context
    rules?: Rules
    metadata?: any | null
    parent?: any | null
}

interface Modifiers {
    animation: any | null
    isForwarding: boolean
    isForwardingActive: boolean
    thumbnailUrl: string | null
    amazonAffiliate: any | null
    layoutOption: string
}

interface Context {
    headerLayoutOption?: string
    embedOption?: string
    integrationId?: any | null
    instagramBusinessAccountId?: any | null
    mediaType?: string
    displayType?: string
    channelId?: any | null
    subscribe?: any | null
}

interface Rules {
    gate: Gate
}

interface Gate {
    activeOrder: any[]
    sensitiveContent: SensitiveContent
    age: any | null
    passcode: any | null
    nft: any | null
    payment: any | null
}

interface SensitiveContent {
    domain: string
}

interface Theme {
    key: string
    mode: string
    colors: {
        body: string
        linkBackground: string
        linkText: string
        linkShadow: string
    }
    components: Components
}

interface Components {
    SignupSubmitButton: {
        borderLeftWidth: string
        borderLeftColor: string
    }
    ProfileBackground: {
        backgroundColor: string
        backgroundStyle: string
    }
    ProfileDescription: {
        color: string
    }
    LinkContainer: {
        borderRadius: string
        gridBorderRadius: string
        embedContentRadius: string
        styleType: string
    }
    LinkHeader: {
        color: string
    }
    LinkThumbnail: {
        borderRadius: string
        size: string
    }
    SocialLink: {
        fill: string
    }
    Banner: {
        default: {
            backgroundColor: string
            color: string
        }
    }
    Footer: {
        logo: string
    }
}

interface ThemeV2 {
    key: string
    luminance: string
    background: {
        type: string
    }
    buttonStyle: ButtonStyle
    typeface: Typeface
}

interface ButtonStyle {
    type: string
    backgroundStyle: {
        color: string
    }
    shadowStyle: {
        color: string
    }
    textStyle: {
        color: string
    }
}

interface Typeface {
    color: string
    family: string
}

interface LinktreeEnvironment {
    LINK_TYPES_ASSETS_ENDPOINT: string
    STRIPE_PAYMENTS_API_ENDPOINT: string
    STRIPE_PUBLISHABLE_KEY: string
    PAYPAL_PAYMENTS_API_ENDPOINT: string
    PAYPAL_PAYMENTS_CLIENT_ID: string
    SHOPIFY_INTEGRATIONS_API_ENDPOINT: string
    META_IMAGE_URL: string
    RECAPTCHA_SITE_KEY: string
    RECAPTCHA_SITE_KEY_INVISIBLE: string
    GRAPHQL_API_ENDPOINT: string
    PROFILES_API_HOST: string
    LINKER_RECOMMENDATIONS_ENDPOINT: string
    BASE_PROFILE_URL: string
    CDN_DISTRIBUTION_URL: string
}

interface LinktreeAuth0Config {
    clientID: string
    domain: string
    redirectUri: string
    responseType: string
    responseMode: string
    audience: string
    plugins: Plugins
    _sendTelemetry: boolean
    _timesToRetryFailedRequests: number
    tenant: string
    token_issuer: string
    legacySameSiteCookie: boolean
    rootUrl: string
    universalLoginPage: boolean
}

interface Plugins {
    plugins: any[]
}

interface StatsigInitValues {
    featureGates: {
        profilepage_structured_data: boolean
    }
    experiments: any
    layers: any
}

export interface LinktreePageProps {
    account: LinktreeAccount
    theme: Theme
    isProfileVerified: boolean
    hasConsentedToView: boolean
    username: string
    pageTitle: string
    description: string
    socialLinks: any[]
    integrations: any[]
    seoSchemaClassifications: {
        typeClassification: any | null
    }
    metaTitle: string
    metaDescription: string
    profilePictureUrl: string
    links: LinktreeLinkEntry[]
    leapLink: any | null
    isOwner: boolean
    isLogoVisible: boolean
    footerCtaButtonVariation: string
    userAgent: string
    stage: string
    storeProducts: any[]
    storeCollections: any[]
    storeHasAffiliateProducts: boolean
    defaultPage: string
    environment: LinktreeEnvironment
    contentGating: string
    videoStructuredData: any[]
    hasSensitiveContent: boolean
    auth0Config: LinktreeAuth0Config
    followerNotificationsEnabled: boolean
    followerCapabilities: any | null
    isPreview: boolean
    statsigInitValues: StatsigInitValues
}
