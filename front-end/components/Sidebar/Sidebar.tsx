import React, { useState, useEffect, useRef, FC } from 'react';
import { useLocation } from 'react-router';
import clsx from 'clsx';
import { useHoverDirty } from 'react-use';
import { observer } from 'mobx-react-lite';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { SidebarContent } from './SidebarContent';
import { ImageLoader } from '../../components/ImageLoader';
import { buildBreadCrumbs } from '../../helpers/route/buildBreadCrumbs';

import LockOpenIcon from '@material-ui/icons/LockOpen';
import SecurityIcon from '@material-ui/icons/Security';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PublicIcon from '@material-ui/icons/Public';

import {
    SECURITY_LOCK_OUT_ROUTE,
    SECURITY_AUDIT_ROUTE,
    POI_TYPES_ROUTE,
    ACCOUNTS_ROUTE,
    SCHEMAS_ROUTE,
    USERS_ROUTE,
    APPS_ROUTE,
    COUNTRIES_ROUTE
} from '../../constants/Router';

import sidebarIcon from '../../../assets/images/sidebar-expanded.svg';

import { ReactComponent as UsersIcon } from '../../../assets/images/users.svg';
import { ReactComponent as SchemasIcon } from '../../../assets/images/schemas.svg';
import { ReactComponent as AppsIcon } from '../../../assets/images/application.svg';
import { ReactComponent as AccountsIcon } from '../../../assets/images/accounts.svg';

import { useStyles } from './styles';

export interface INavigationTab {
    label: string;
    to: string;
    icon?: JSX.Element;
    enabled?: boolean;
    children?: INavigationTab[];
}

const adminRoutes: INavigationTab[] = [
    {
        label: 'Accounts',
        icon: <AccountsIcon />,
        to: ACCOUNTS_ROUTE,
        enabled: true
    },
    {
        label: 'Users',
        icon: <UsersIcon />,
        to: USERS_ROUTE,
        enabled: true
    },
    {
        label: 'Apps',
        icon: <AppsIcon />,
        to: APPS_ROUTE,
        enabled: true,
    },
    {
        label: 'Countries',
        icon: <PublicIcon />,
        to: COUNTRIES_ROUTE,
        enabled: true,
    },
    {
        label: 'Schemas',
        icon: <SchemasIcon />,
        to: SCHEMAS_ROUTE,
        enabled: true,
    },
    {
        label: 'Poi Types',
        icon: <LocationOnIcon />,
        to: POI_TYPES_ROUTE,
        enabled: true
    },
    {
        label: 'Security',
        icon: <LockOpenIcon />,
        to: SECURITY_AUDIT_ROUTE,
        enabled: true,
        children: [
            {
                label: 'Audit',
                icon: <SecurityIcon />,
                to: SECURITY_AUDIT_ROUTE,
                enabled: true
            },
            {
                label: 'Lock Out',
                icon: <VerifiedUserIcon />,
                to: SECURITY_LOCK_OUT_ROUTE,
                enabled: true
            }
        ]
    }
];

const userRoutes: INavigationTab[] = [
    {
        label: 'Users',
        icon: <UsersIcon />,
        to: USERS_ROUTE,
        enabled: true
    },
    {
        label: 'Apps',
        icon: <AppsIcon />,
        to: APPS_ROUTE,
        enabled: true
    },
    {
        label: 'Apps Schemas',
        icon: <SchemasIcon />,
        to: SCHEMAS_ROUTE,
        enabled: true,
    }
];

interface IProps {
    isSidebarOpen: boolean;
    onToggle: () => void;
    isAdmin: boolean;
}

const Sidebar: FC<IProps> = observer(({ onToggle, isSidebarOpen, isAdmin }) => {
    const classes = useStyles();
    const drawerRef = useRef(null);
    const isHovering = useHoverDirty(drawerRef);
    const { pathname } = useLocation();
    const [initActiveSections, setInitActiveSections] = useState([]);

    const options = isAdmin ? adminRoutes : userRoutes;

    useEffect(() => {
        const pathNames = buildBreadCrumbs(options);
        setInitActiveSections(pathNames[pathname] || []);
    }, [pathname]);

    return (
        <Drawer
            ref={drawerRef}
            variant='permanent'
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: isSidebarOpen,
                [classes.drawerClose]: !isSidebarOpen
            })}
            classes={{
                paper: clsx(classes.paper, {
                    [classes.drawerOpen]: isSidebarOpen,
                    [classes.drawerClose]: !isSidebarOpen
                })
            }}
        >
            <Fade in={isHovering}>
                <Fab
                    disableRipple
                    onClick={onToggle}
                    className={clsx(classes.toggleButton, {
                        [classes.toggleButtonOpen]: isSidebarOpen
                    })}
                >
                    <ChevronRightIcon />
                </Fab>
            </Fade>

            <Box className={classes.toolbar}>
                <Box className={classes.logoWrapper}>
                    <Fade in={isSidebarOpen}>
                        <ImageLoader
                            className={classes.toolbarLogo}
                            src={sidebarIcon}
                        />
                    </Fade>
                </Box>
            </Box>
            <Divider className={classes.divider} />
            <Box className={classes.content}>
                <Box className={classes.navigationWrapper}>
                    <Box className={classes.navigation}>
                        <SidebarContent
                            className={classes.sidebar}
                            isOpen={isSidebarOpen}
                            options={options}
                            initActiveSections={initActiveSections}
                        />
                    </Box>
                </Box>
                <Grid container direction='column' alignContent='center'>
                    <Divider className={classes.docLinkDivider} />
                    <Grid
                        container
                        justifyContent='center'
                        wrap='nowrap'
                        direction={isSidebarOpen ? 'row' : 'column'}
                        alignItems={isSidebarOpen ? 'flex-end' : 'center'}
                        className={clsx(classes.logo, {
                            [classes.logoClosed]: !isSidebarOpen
                        })}
                    >
                        {isSidebarOpen && (
                            <>
                                <Typography className={classes.byText}>
                                    By
                                </Typography>
                                <ImageLoader
                                    className={classes.sidebarLogo}
                                    src={sidebarIcon}
                                />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    );
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
