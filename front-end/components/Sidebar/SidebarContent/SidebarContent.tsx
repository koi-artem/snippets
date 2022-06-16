import React, { memo, useCallback, useState, Fragment, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { INavigationTab } from '../Sidebar';

interface IProps {
    isOpen: boolean;
    options?: INavigationTab[];
    className?: string;
    initActiveSections?: string[];
}

const renderNavigation = (
    label: string,
    isOpen: boolean,
    options: INavigationTab[],
    activeSections: string[],
    setActiveSection: (section: string) => void,
    resetActiveSection: () => void
): JSX.Element => {
    return (
        <Fragment key={label}>
            <Navigation
                key={label}
                items={options}
                isOpen={isOpen}
                parentSection={label}
                activeSections={activeSections}
                setActiveSection={setActiveSection}
                resetActiveSection={resetActiveSection}
            />
            {options.map(({ children: _children = [], label: _label }) => {
                return renderNavigation(
                    _label,
                    isOpen,
                    _children,
                    activeSections,
                    setActiveSection,
                    resetActiveSection
                );
            })}
        </Fragment>
    );
};

const SidebarContent = memo(
    ({ isOpen, options = [], initActiveSections, ...rest }: IProps) => {
        const [activeSections, setActiveSections] = useState<string[]>([]);

        useEffect(() => {
            setActiveSections(() => initActiveSections);
        }, [initActiveSections]);

        const addSection = useCallback(
            (sectionToAdd: string) => {
                setActiveSections((sections) => [...sections, sectionToAdd]);
            },
            [activeSections]
        );

        const resetActiveSection = useCallback(() => {
            if (activeSections.length > 0) {
                setActiveSections((sections) => sections.slice(0, -1));
            }
        }, [activeSections]);

        return (
            <div {...rest} key='root'>
                <Navigation
                    key='root'
                    items={options}
                    isOpen={isOpen}
                    setActiveSection={addSection}
                />
                {options.map(({ children: _children = [], label }) => {
                    return renderNavigation(
                        label,
                        isOpen,
                        _children,
                        activeSections,
                        addSection,
                        resetActiveSection
                    );
                })}
            </div>
        );
    }
);

export { SidebarContent };
