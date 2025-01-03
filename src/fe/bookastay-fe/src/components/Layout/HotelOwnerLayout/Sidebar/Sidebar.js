import styled from "styled-components";
import { IoChevronBack } from "react-icons/io5";
import NavLink from "./NavLink";
import NavLinksGroup from "./NavLinksGroup";

import "./Sidebar.scss";
import Backdrop from "./Backdrop";
import { useState } from "react";
import { Link } from "react-router-dom";

const breakpoints = {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px",
};

const StyledSidebar = styled.nav.withConfig({
    shouldForwardProp: (prop) => prop !== "visible" && prop !== "compact", // Chỉ lọc prop 'visible'
})`
    display: flex;
    flex-direction: column;

    background-color: #fff;
    color: #333;
    height: 100vh;

    width: ${(p) => (p.compact ? "70px" : "256px")};

    position: sticky;
    top: 0;

    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

    z-index: 1000;

    &::before {
        content: "";
        position: absolute;

        width: 100%;
        height: 100%;
        opacity: 0.5;
        z-index: -1;
    }

    @media (max-width: calc(${breakpoints.xl} - 0.02px)) {
        position: fixed;
        transform: translate3d(${(p) => (p.visible ? 0 : "calc(256px - 256px * 2)")}, 0, 0);

        transition: transform 0.3s
            ${(p) => (p.visible ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0, 0, 0.2, 1)")} !important;
    }
`;

const StyledHeader = styled.h1.withConfig({
    shouldForwardProp: (prop) => prop !== "compact",
})`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1rem;

    border-bottom: 1px solid #ddd;

    height: 80px;
    text-align: center;

    font-size: 3.2rem;
    font-weight: 500;
    color: #000;
    letter-spacing: 1px;

    span {
        display: ${(p) => (Number(!p.compact) ? "inline" : "none")};
    }
`;

const Sidebar = (props) => {
    const [compact, setCompact] = useState(0);

    return (
        <>
            <Backdrop visible={props.visible} onClick={props.close} />
            <StyledSidebar compact={compact} visible={props.visible}>
                <StyledHeader compact={compact}>
                    <Link to="/hotel-owner">
                        B<span>ookaStay</span>
                    </Link>
                </StyledHeader>

                <NavLinksGroup compact={compact} />

                <div className="w-100 d-flex align-items-center justify-content-center p-3">
                    <button
                        className="sidebar__toggle"
                        onClick={() => setCompact(Number(!compact))}
                    >
                        <IoChevronBack />
                    </button>
                </div>
            </StyledSidebar>
        </>
    );
};

export default Sidebar;
