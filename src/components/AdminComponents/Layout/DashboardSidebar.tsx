import React, { FC } from 'react';
import { Drawer, Hidden } from '@material-ui/core';
import DashboardSidebarContent from './DashboardSidebarContent';

export type Props = {
  depositMode: boolean;
};

const DashboardSidebar: FC<Props> = ({ depositMode }) => {
  return (
    <>
      <Hidden>
        <Drawer anchor="left" open variant="persistent">
          <DashboardSidebarContent depositMode={depositMode} />
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
