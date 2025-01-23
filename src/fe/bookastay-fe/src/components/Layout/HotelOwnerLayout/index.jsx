import styled from "styled-components";
import { useState } from "react";

import Header from "./Header/index";
import Sidebar from "./Sidebar/Sidebar";

const Grid = styled.div`
    display: grid;
    grid:
        "nav header" min-content
        "nav content" 1fr / min-content 1fr;

    min-height: 100vh;
`;

const GridNav = styled.div`
    grid-area: nav;
    z-index: 100;
`;

const GridHeader = styled.header`
    grid-area: header;
`;

const GridContent = styled.div`
    grid-area: content;
`;

const HotelOwnerLayout = ({ children }) => {
    const [showSidebar, setShowSidebar] = useState(0);
    const toggle = () => {
        setShowSidebar(Number(!showSidebar));
    };

    return (
        <Grid>
            <GridNav>
                <Sidebar visible={showSidebar} close={toggle} />
            </GridNav>
            <GridHeader>
                <Header toggle={toggle} />
            </GridHeader>
            <GridContent className="container mt-5">
                <div className="content">{children}</div>
            </GridContent>
        </Grid>
    );
};

export default HotelOwnerLayout;
