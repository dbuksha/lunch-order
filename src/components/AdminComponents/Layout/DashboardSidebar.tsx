import React, { FC, useEffect, useState } from 'react';
import { Drawer, Hidden } from '@material-ui/core';
import DashboardSidebarContent from './DashboardSidebarContent';

export type HasDepositProps = {
  depositMode: boolean;
  mobileMenu?: boolean;
};

const tabletPortrait = 960;

const DashboardSidebar: FC<HasDepositProps> = ({ depositMode, mobileMenu }) => {
  const [navigationStatus, setNavigationStatus] = useState(mobileMenu);

  useEffect(() => {
    function navigationStatus() {
      if (window.innerWidth > tabletPortrait) {
        setNavigationStatus(true);
        return;
      }

      setNavigationStatus(mobileMenu);
    }

    window.addEventListener('resize', navigationStatus);

    navigationStatus();

    return () => window.removeEventListener('resize', navigationStatus);
  }, []);

  return (
    <>
      <Hidden>
        <Drawer
          anchor="left"
          open={
            window.innerWidth > tabletPortrait ? navigationStatus : mobileMenu
          }
          variant="persistent"
        >
          <DashboardSidebarContent depositMode={depositMode} />
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
