import React from 'react';
import { SocialMediaHeader } from '../../components/social/header';
import { SocialMediaSideMenu } from '../../components/social/sideMenu';
import { Redirect, Switch } from 'react-router-dom';
import RouteWithSubRoutes from '../../components/common/RouteWithSubRoutes/index';
import { routePaths } from '../../common/routeConfig';
import './index.module.scss';

export const SocialMediaMain = (props) => {
    //props
    const { social, routes  } = props;
    return (
        <div>
            <SocialMediaHeader />
            <SocialMediaSideMenu />
            <Switch>
                {
                    routes.map((route, i) => (
                        <RouteWithSubRoutes
                            key={i}
                            {...route}
                        />
                    ))
                }
                <Redirect to={routePaths.feed} />
            </Switch>
        </div>
    );
}
