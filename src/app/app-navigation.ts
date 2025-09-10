export const navigation = [
    {
        text: 'CDS Demo',
        path: '/cds',
        icon: 'fas fa-cog',
    },
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
