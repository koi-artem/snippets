import React, {
    useCallback,
    useMemo
} from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import cx from 'clsx';

import { useStores } from '../../../hooks';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { INavigationTab } from '../Sidebar';

import { useStyles } from './styles';

interface IProps {
    isOpen: boolean;
    items?: INavigationTab[];
    parentSection?: string;
    activeSections?: string[];
    setActiveSection?: (parentName: string) => void;
    resetActiveSection?: () => void;
}
const Navigation = observer(
    ({
        isOpen,
        items = [],
        parentSection,
        activeSections = [],
        setActiveSection,
        resetActiveSection
    }: IProps) => {
        const classes = useStyles();
        const {
            rootStore: {
                authStore: { isLoading }
            }
        } = useStores();
        const setActive = useCallback(
            (label) => () => setActiveSection(label),
            [items]
        );

        const handleClick = useCallback(
            (disabled: boolean) => (e: React.MouseEvent<HTMLElement>) => {
                if (disabled) e.preventDefault();
            },
            [items]
        );

        const handleIconClick = useCallback(
            (label: string, enabled: boolean) => () => {
                if (!enabled) return;

                setActiveSection(label);
            },
            []
        );

        const resetActive = useCallback(() => {
            resetActiveSection();
        }, [activeSections]);

        const hasParentSection = useMemo(
            () => Boolean(parentSection),
            [parentSection]
        );
        const parentSectionIndex = useMemo(
            () => activeSections.indexOf(parentSection),
            [parentSection, activeSections]
        );

        const isActiveSection = useMemo(
            () =>
                hasParentSection &&
                parentSection === activeSections[activeSections.length - 1],
            [hasParentSection, parentSection, activeSections]
        );

        const isActiveParentSections = useMemo(
            () =>
                hasParentSection &&
                parentSectionIndex !== -1 &&
                parentSectionIndex !== activeSections.length - 1,
            [
                hasParentSection,
                parentSectionIndex,
                parentSection,
                activeSections
            ]
        );

        if (isLoading) return null;
        if (items.length === 0) return null;

        return (
            <List
                className={cx(classes.list, {
                    [classes.childSection]: hasParentSection,
                    [classes.active]: isActiveSection,
                    [classes.activeParent]: isActiveParentSections
                })}
            >
                {parentSection && (
                    <ListItem
                        button
                        disableRipple
                        onClick={resetActive}
                        className={cx(classes.listItem, classes.backListItem)}
                        classes={{
                            container: classes.container
                        }}
                    >
                        <ListItemIcon
                            className={cx(classes.icon, classes.backIcon)}
                        >
                            <ChevronLeftIcon />
                        </ListItemIcon>
                        {isOpen && (
                            <ListItemText
                                className={classes.listItemText}
                                classes={{
                                    primary: classes.backListItemText
                                }}
                            >
                                Back
                            </ListItemText>
                        )}
                    </ListItem>
                )}
                {items.map(({ label, to, icon, enabled, children }) => (
                    <NavLink
                        activeClassName={classes.activeLink}
                        to={to}
                        onClick={handleClick(!enabled)}
                        key={`${to}_${label}`}
                        className={cx(classes.link, {
                            disabled: !enabled
                        })}
                    >
                        <ListItem
                            key={label}
                            className={classes.listItem}
                            classes={{
                                container: classes.container
                            }}
                        >
                            <ListItemIcon
                                onClick={handleIconClick(
                                    label,
                                    !isOpen && Boolean(children)
                                )}
                                className={classes.icon}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                className={classes.listItemText}
                                classes={{
                                    primary: classes.text
                                }}
                            >
                                {label}
                            </ListItemText>
                            {children && (
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge='end'
                                        aria-label='navigate'
                                        onClick={setActive(label)}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        );
    }
);

export { Navigation };
