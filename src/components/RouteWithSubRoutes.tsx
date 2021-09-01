import React, { FC } from 'react';
import { Route } from 'react-router-dom';

import { RouteProp } from '../router/routes-props';

// const RouteWithSubRoutes = (route) => {
//     return (
//     <Route
//         path={route.path}
//         render={(props) => (
//             <route.component {...props} routes={route.routes} />.
//         )}
//     />
//     );
// };

const RouteWithSubRoutes = (route: RouteProp) => {
  // console.log(route.routes, route.path);

  // return (
  //   <Route
  //     path={route.path}
  //     render={(props) => <route.component {...props} routes={route.routes} />}
  //   />
  // );

  if (route.routes?.length) {
    return (
      <Route
        path={route.path}
        render={(props) => <route.component {...props} />}
      />
    );
  }

  return (
    <Route path={route.path} exact={route.exact}>
      <route.component />
    </Route>
  );
};

export default RouteWithSubRoutes;
