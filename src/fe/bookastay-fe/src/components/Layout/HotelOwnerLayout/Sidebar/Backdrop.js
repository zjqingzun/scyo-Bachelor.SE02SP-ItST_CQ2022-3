import styled, { css } from "styled-components";

import breakpoints from "~/utils/screenBreakpoints";

const Backdrop = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "visible", // Chỉ lọc prop 'visible'
})`
    position: fixed;

    width: 100vw;
    height: 100vh;

    opacity: 0;

    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.5);

    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

    ${(p) =>
        p.visible &&
        css`
            opacity: 1;
            pointer-events: all;
        `}

    @media (min-width: calc(${breakpoints.xl} - 0.02px)) {
        opacity: 0;
        pointer-events: none;
    }
`;

export default Backdrop;
