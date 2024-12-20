import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link).withConfig({
    shouldForwardProp: (prop) => prop !== "compact",
})`
    min-height: 50px;

    display: flex;
    align-items: center;
    gap: 1rem;

    padding: ${(p) => (!Number(!p.compact) ? "1rem 2rem" : "0px 1rem")};

    font-size: 1.6rem;
    font-weight: 500;

    color: #333;

    box-shadow: 0 -1px 0 0 rgba(255, 255, 255, 0.1);

    &:hover {
        background-color: #f5f5f5;
    }

    &.active {
        background-color: #f5f5f5;
    }
`;

const NavLink = ({ to, icon: Icon, children, label }) => {
    return (
        <StyledLink to={to}>
            {children || (
                <>
                    <Icon size={25} />
                    {label && <span>{label}</span>}
                </>
            )}
        </StyledLink>
    );
};

export default NavLink;
