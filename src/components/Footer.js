import React from "react";
import { Menu } from "semantic-ui-react";

import { Tab, Form, Button, Grid, Icon } from "semantic-ui-react";

export default () => {
    return(
        <Menu style={{ marginTop: '100px' , bottom: '0px'}} text>
            <Menu.Item>
                About Us <br />
                We are a company, ParkIt, which provides parking slots!
            </Menu.Item>

        </Menu>
    )
}