import type { ThemeConfig } from 'antd';

/**
 * Custom Ant Design theme configuration
 * This theme provides a modern, premium look with vibrant colors
 */
export const themeConfig: ThemeConfig = {
    token: {
        // Primary brand color - vibrant blue
        colorPrimary: '#1677ff',

        // Border radius for components
        borderRadius: 8,

        // Font family
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

        // Font sizes
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontSizeHeading4: 20,
        fontSizeHeading5: 16,

        // Spacing
        padding: 16,
        margin: 16,

        // Colors
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',

        // Link colors
        colorLink: '#1677ff',
        colorLinkHover: '#4096ff',
        colorLinkActive: '#0958d9',
    },
    components: {
        Layout: {
            headerBg: '#ffffff',
            siderBg: '#ffffff',
            bodyBg: '#f5f5f5',
        },
        Button: {
            primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
        },
        Card: {
            boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        },
        Table: {
            headerBg: '#fafafa',
            headerSortActiveBg: '#f0f0f0',
            bodySortBg: '#fafafa',
        },
        Menu: {
            itemSelectedBg: '#e6f4ff',
            itemActiveBg: '#f5f5f5',
        },
    },
};

export default themeConfig;
