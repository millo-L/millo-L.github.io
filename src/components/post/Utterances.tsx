import React, { createRef, useLayoutEffect } from 'react';

const src = 'https://utteranc.es/client.js';

interface IUtterancesProps {
}

const Utterances = React.memo(({ }: IUtterancesProps) => {
    const containerRef = createRef<HTMLDivElement>();

    useLayoutEffect(() => {
        const utterances = document.createElement('script');

        const attributes = {
            src,
            repo: 'millo-L/millo-L.github.io',
            'issue-term': 'pathname',
            label: 'comment',
            theme: 'github-light',
            crossOrigin: 'anonymous',
            async: 'true',
        };

        Object.entries(attributes).forEach(([key, value]) => {
            utterances.setAttribute(key, value);
        });

        containerRef.current.appendChild(utterances);
    }, []);

    return <div ref={containerRef} />;
});

Utterances.displayName = 'Utterances';

export default Utterances;