import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useStore } from "../stores/store";

interface Props extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    role?: string;
}

export default function PrivateRoute({ component: Component, role, ...rest }: Props) {
    const { userStore: { isLoggedIn, user } } = useStore();
    if (role && role !== user?.role) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/questions' }} />
    }
    return (
        <Route
            {...rest}
            render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to='/' />}
        />
    )
}