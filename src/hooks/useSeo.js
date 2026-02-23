import { useEffect } from 'react';export const useSeo = ({ title, description, image, url, schema }) => {
    useEffect(() => {
        const defaultTitle = 'GenBI Unsika - Generasi Baru Indonesia';
        document.title = title ? `${title} | GenBI Unsika` : defaultTitle;

        const currentUrl = url || window.location.href;

        const updateMeta = (property, value, isProperty = true) => {
            if (!value) return;
            const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
            let el = document.querySelector(selector);

            if (!el) {
                el = document.createElement('meta');
                if (isProperty) el.setAttribute('property', property);
                else el.setAttribute('name', property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);

        updateMeta('description', description, false);

        updateMeta('og:title', title || defaultTitle);
        updateMeta('og:description', description);
        updateMeta('og:url', currentUrl);
        if (image) updateMeta('og:image', image);

        updateMeta('twitter:title', title || defaultTitle);
        updateMeta('twitter:description', description);
        if (image) updateMeta('twitter:image', image);
        if (url) updateMeta('twitter:url', currentUrl);

        let script = document.querySelector('script[type="application/ld+json"]');
        if (schema) {
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.text = JSON.stringify(schema);
        } else if (script) {
            script.remove();
        }

    }, [title, description, image, url, schema]);
};
