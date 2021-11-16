import React from 'react'
import { Switch, useHistory, Route } from 'react-router-dom'
import { routePaths } from '../../common/routeConfig'
import RouteWithSubRoutes from '../../components/common/RouteWithSubRoutes'
import { SliderList } from './SliderList'

export const Slider = (props) => {
    // props
    const {
        routes,
        location,
    } = props;

    // store
    const history = useHistory();

    return (
        <Switch>
            {
                routes.map((route, i) => (
                    <RouteWithSubRoutes
                        key={i}
                        {...route}
                    />
                ))
            }
            <Route to={routePaths.slider}>
                <SliderList />
            </Route>
        </Switch>
    )
}
