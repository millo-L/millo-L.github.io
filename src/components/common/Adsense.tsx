import React from "react";
import { Helmet } from "react-helmet";

interface AdsenseProps {
    style?: React.CSSProperties;
    adClient?: string;
    adSlot?: string;
    adFormat?: string;
    adLayout?: string;
    fullWidthResponsive?: string;
}

const Adsense = ({
    style,
    adClient,
    adSlot,
    adFormat,
    adLayout,
    fullWidthResponsive,
}: AdsenseProps) => {
    return (
        <>
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            ></script>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-ad-layout={adLayout}
                data-full-width-responsive={fullWidthResponsive}
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </>
    );
};

export default Adsense;
