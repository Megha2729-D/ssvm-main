import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar, activeCategory, setActiveCategory, handleLogout }) => {
    
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: 'bi-grid-fill', group: null },
        { 
            group: 'Guru Awards',
            items: [
                { id: 'guru-internal-self', label: 'Internal - Self', icon: 'bi-person-badge' },
                { id: 'guru-internal-others', label: 'Internal - Others', icon: 'bi-person-plus' },
                { id: 'guru-external-self', label: 'External - Self', icon: 'bi-globe' },
                { id: 'guru-external-others', label: 'External - Others', icon: 'bi-people' },
            ]
        },
        {
            group: 'Studentpreneur',
            items: [
                { id: 'student-internal', label: 'Internal', icon: 'bi-mortarboard' },
                { id: 'student-external', label: 'External', icon: 'bi-browser-edge' },
            ]
        },
        {
            group: 'Administrative',
            items: [
                { id: 'settings', label: 'Settings', icon: 'bi-gear' }
            ]
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">SS</div>
                <span>SSVM ADMIN</span>
                <button className="mobile-close-btn" onClick={toggleSidebar}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            
            <nav className="sidebar-nav">
                {menuItems.map((group, idx) => (
                    <React.Fragment key={idx}>
                        {group.group ? (
                            <>
                                <div className="nav-group-label">{group.group}</div>
                                {group.items.map(item => (
                                    <div 
                                        key={item.id} 
                                        className={`nav-item sub-item ${activeCategory === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(item.id)}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div 
                                className={`nav-item ${activeCategory === group.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(group.id)}
                            >
                                <i className={`bi ${group.icon}`}></i>
                                <span>{group.label}</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn-full">
                    <i className="bi bi-box-arrow-left"></i>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
