import makeStyles from '@material-ui/core/styles/makeStyles';

import {
    DRAWER_WIDTH,
    HEADER_HEIGHT,
    DRAWER_CLOSED_WIDTH
} from '../../constants/Dimentions';

const DIVIDER_HEIGHT: number = 2;

export const useStyles = makeStyles(theme => ({
    hide: {
        display: 'none'
    },
    drawer: {
        position: 'relative',
        width: DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: DRAWER_WIDTH,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        // overflowX: 'hidden',
        width: DRAWER_CLOSED_WIDTH
    },
    divider: {
        height: DIVIDER_HEIGHT
    },
    toolbar: {
        height: HEADER_HEIGHT - DIVIDER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2, 3),
        ...theme.mixins.toolbar
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    toolbarLogo: {
        minHeight: '100%',
    },
    paper: {
        overflow: 'visible',
        border: 'none',
        boxShadow: '6px 0 18px rgba(0, 0, 0, .06)'
    },
    content: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden auto',
    },
    navigationWrapper: {
        display: 'flex',
        flex: '1'
    },
    navigation: {
        width: DRAWER_WIDTH,
        display: 'flex',
        flex: '1',
        position: 'relative'
    },
    sidebar: {
        width: DRAWER_WIDTH,
        display: 'flex',
        flex: '1'
    },
    byText: {
        color: theme.extendPalette.grey,
        fontSize: theme.typography.pxToRem(14),
        marginRight: theme.typography.pxToRem(3),
    },
    sidebarLogo: {
        height: 16
    },
    docLink: {
        width: '100%',
        color: theme.extendPalette.regentGrey,
        marginBottom: theme.spacing(2.5),
        '&:hover': {
            color: theme.extendPalette.tuna
        }
    },
    docLinkText: {
        fontSize: 14,
        fontWeight: 500,
        textAlign: 'center',
        color: 'inherit'
    },
    docLinkIcon: {
        fontSize: 15,
        color: 'inherit',
        marginLeft: theme.spacing(0.625)
    },
    docLinkDivider: {
        height: 2,
        backgroundColor: theme.extendPalette.lightGrey
    },
    logo: {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        minHeight: 20,
        margin: theme.spacing(2.5, 0)
    },
    logoClosed: {
        margin: theme.spacing(1.375, 0)
    },
    toggleButton: {
        position: 'absolute',
        top: 100,
        right: -16,
        width: 32,
        height: 32,
        minHeight: 32,
        zIndex: theme.zIndex.appBar + 1,
        background: theme.extendPalette.white,
        border: `2px solid ${theme.extendPalette.cornflowerBlue}`,
        boxSizing: 'border-box',
        boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
        color: theme.extendPalette.cornflowerBlue,
        transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        '&:hover': {
            backgroundColor: 'unset'
        },
        '&:active': {
            boxShadow: 'none'
        }
    },
    toggleButtonOpen:{
        transform: 'rotate(180deg)'
    }
}));
