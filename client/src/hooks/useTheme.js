import { useEffect } from 'react';

const useTheme = (settings) => {
    useEffect(() => {
        if (!settings) return;

        const root = document.documentElement;
        
        // Theme Mode
        if (settings.themeMode === 'light') {
            root.classList.remove('dark');
            root.style.setProperty('--bg', '#f8fafc');
            root.style.setProperty('--surface', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--surface-solid', '#ffffff');
            root.style.setProperty('--text', '#0f172a');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
        } else {
            root.classList.add('dark');
            root.style.setProperty('--bg', '#0b0f19');
            root.style.setProperty('--surface', 'rgba(30, 41, 59, 0.4)');
            root.style.setProperty('--surface-solid', '#1e293b');
            root.style.setProperty('--text', '#f8fafc');
            root.style.setProperty('--text-muted', '#94a3b8');
            root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
        }

        // Theme Color
        if (settings.themeColor) {
            root.style.setProperty('--primary', settings.themeColor);
            root.style.setProperty('--primary-dark', darkenColor(settings.themeColor, 10));
            root.style.setProperty('--primary-light', hexToRGBA(settings.themeColor, 0.2));
            root.style.setProperty('--primary-glow', `0 0 20px ${hexToRGBA(settings.themeColor, 0.4)}`);
        }

        // Font Size
        const fontSizes = {
            'Small': '14px',
            'Medium': '16px',
            'Large': '18px',
            'Extra Large': '20px'
        };
        if (settings.fontSize && fontSizes[settings.fontSize]) {
            root.style.setProperty('font-size', fontSizes[settings.fontSize]);
        }

    }, [settings]);
};

// Helper to darken a hex color
function darkenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper for RGBA
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default useTheme;
