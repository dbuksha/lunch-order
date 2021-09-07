import React, { FC } from 'react';
import { Drawer, Hidden } from '@material-ui/core';
import DashboardSidebarContent from './DashboardSidebarContent';

const DashboardSidebar: FC = () => {
  return (
    <>
      <Hidden>
        <Drawer anchor="left" open variant="persistent">
          <DashboardSidebarContent />
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
