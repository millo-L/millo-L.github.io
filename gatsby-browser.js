require("./static/css/prism-vsc-dark-plus.css");
export const onClientEntry = async () => {
    if (typeof IntersectionObserver === "undefined") {
        await import("intersection-observer");
    }
};
