import styled from "styled-components";
import { IoHome } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { MdRoomPreferences } from "react-icons/md";

import NavLink from "./NavLink";

const LinkGroup = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1.5rem;

    max-height: calc(100vh - 80px);
    min-height: 60px;

    padding: 1.5rem;

    overflow: hidden;
    overflow-y: auto;
`;

const DenseNavLink = styled(NavLink).withConfig({
    shouldForwardProp: (prop) => prop !== "compact",
})`
    height: 50px;
`;

const links = [
    {
        to: "/hotel-owner/dashboard",
        icon: IoHome,
        label: "Dashboard",
    },
    {
        to: "/hotel-owner/guest",
        icon: IoPeople,
        label: "Guest",
    },
    {
        to: "/hotel-owner/room",
        icon: FaBookmark,
        label: "Rooms",
    },
    {
        to: "/hotel-owner/room-type",
        icon: MdRoomPreferences,
        label: "Room Type",
    },
];

const NavLinksGroup = (props) => {
    return (
        <>
            {Number(!props.compact) ? (
                <LinkGroup>
                    {links.map((link) => (
                        <DenseNavLink
                            compact={props.compact}
                            key={link.to}
                            to={link.to}
                            icon={link.icon}
                            label={link.label}
                        ></DenseNavLink>
                    ))}
                </LinkGroup>
            ) : (
                <LinkGroup>
                    {links.map((link, index) => (
                        <NavLink
                            compact={props.compact}
                            key={link.to}
                            to={link.to}
                            icon={link.icon}
                        ></NavLink>
                    ))}
                </LinkGroup>
            )}
        </>
    );
};

export default NavLinksGroup;
