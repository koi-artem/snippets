import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.typography.pxToRem(5)
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
        textDecoration: 'none',
        padding: theme.spacing(1, 0),
        color: theme.extendPalette.grey,
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.standard
        }),
        '& svg': {
            fill: theme.extendPalette.grey,
            transition: theme.transitions.create('fill', {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.standard
            })
        },

        '&:hover': {
            color: theme.extendPalette.tuna,
            '& svg': {
                fill: theme.extendPalette.tuna
            }
        },
        '&.disabled': {
            opacity: 0.4
        }
    },
    activeLink: {
        opacity: 1,
        color: theme.extendPalette.cornflowerBlue,
        cursor: 'default',
        '& svg': {
            fill: theme.extendPalette.cornflowerBlue
        }
    },
    listItemText: {
        padding: 0
    },
    headerDivider: {
        margin: theme.spacing(1.375, 0)
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 2.75, 0)
    },
    backListItem: {
        background: theme.extendPalette.paleBlue,
        padding: theme.spacing(2.75, 2)
    },
    backListItemText: {
        fontWeight: 600,
        lineHeight: 1.1875,
        letterSpacing: '0.01em',
        fontSize: 20,
        color: theme.extendPalette.cornflowerBlue,
        whiteSpace: 'normal'
    },
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingRight: theme.spacing(6)
    },
    list: {
        minWidth: '100%',
        marginTop: theme.spacing(1.375),
        padding: 0,
        backgroundColor: theme.palette.common.white,
        transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.enteringScreen
        }),
        willChange: 'transform'
    },
    childSection: {
        marginTop: 0,
        marginBottom: theme.spacing(1.375),
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '100%'
    },
    active: {
        transform: 'translate3d(-100%, 0, 0)'
    },
    activeParent: {
        transform: 'translate3d(-200%, 0, 0)'
    },
    text: {
        fontWeight: 600,
        lineHeight: 1.1875,
        letterSpacing: '0.01em',
        fontSize: 14,
        color: 'inherit',
        whiteSpace: 'normal'
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        marginRight: theme.spacing(2.75)
    },
    backIcon: {
        marginRight: theme.spacing(0.75),
        color: theme.extendPalette.cornflowerBlue,
        '& svg': {
            width: '1.2em',
            height: '1.2em'
        }
    }
}));
