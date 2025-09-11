export interface NavigationItem {
    text: string;
    roles?: string[];
    path?: string;
    icon?: string;
    items?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
    // {
    //     text: 'CdsOptions',
    //     path: '/cds/cds-option',
    //     icon: 'fas fa-cog',
    // },
    {
        text: 'Quick Monitor',
        icon: 'fas fa-chart-line',
        items: [
            {
                text: 'Currency',
                path: '/quick-monitor/currency',
                icon: 'fas fa-dollar-sign',
            },
            {
                text: 'Rates',
                path: '/quick-monitor/rates',
                icon: 'fas fa-percentage',
            },
            {
                text: 'Index',
                path: '/quick-monitor/index',
                icon: 'fas fa-stream',
            },
            {
                text: 'Commodity',
                path: '/quick-monitor/commodity',
                icon: 'fas fa-cubes',
            },
        ],
    },
];
