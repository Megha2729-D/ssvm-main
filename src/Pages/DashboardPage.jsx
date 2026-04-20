import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import SettingsView from '../Component/SettingsView';
import '../assets/registration/DashboardPage.css';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeCategory, setActiveCategory] = useState(localStorage.getItem('activeCategory') || 'overview');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);
    
    // Pagination & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const navigate = useNavigate();
    const mainRef = useRef(null);
    const cardsRef = useRef([]);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));

        if (window.innerWidth < 992) {
            setSidebarOpen(false);
        }
    }, [navigate]);

    // Reset pagination when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // Fetch data when activeCategory, page, or searchTerm changes
    useEffect(() => {
        localStorage.setItem('activeCategory', activeCategory);
        
        // Debounce search
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        
        searchTimeoutRef.current = setTimeout(() => {
            if (activeCategory === 'overview') {
                fetchRegistrations(null, currentPage, searchTerm);
            } else if (activeCategory !== 'settings') {
                fetchRegistrations(activeCategory, currentPage, searchTerm);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(searchTimeoutRef.current);
    }, [activeCategory, currentPage, searchTerm]);

    const fetchRegistrations = async (categoryId = null, page = 1, search = '') => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        let url = `https://new.ssvmtransformingindia.com/public/api/registrations?page=${page}`;
        
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        if (categoryId && categoryId !== 'overview') {
            if (categoryId.startsWith('guru-')) {
                const typeMap = {
                    'guru-internal-self': 'internal-self',
                    'guru-internal-others': 'internal-other',
                    'guru-external-self': 'external-self',
                    'guru-external-others': 'external-other'
                };
                url += `&award_group=guru&nomination_type=${typeMap[categoryId]}`;
            } else if (categoryId.startsWith('student-')) {
                const typeMap = {
                    'student-internal': 'internal',
                    'student-external': 'external'
                };
                url += `&award_group=studentpreneur&nomination_type=${typeMap[categoryId]}`;
            }
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success) {
                setRegistrations(result.data);
                setCurrentPage(result.current_page);
                setLastPage(result.last_page);
                setTotalRecords(result.total);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleExport = () => {
        if (registrations.length === 0) {
            showToast('No records to export', 'error');
            return;
        }

        const isStudent = activeCategory.startsWith('student');
        const isGuru = activeCategory.startsWith('guru');

        let headers = [];
        if (isStudent) {
            headers = [
                'S No', 'Reg No', 'Name', 'Grade', 'Applicant Email', 'Applicant Mobile No', 
                'School Name', 'School City', 'School Phone no', 'School Email', 
                'Business Idea', 'Total Members', 'Pitch Deck URL', 'Date'
            ];
        } else if (isGuru) {
            headers = [
                'S No', 'Reg No', 'Teacher Name', 'Email', 'Phone', 'School Name', 
                'Subjects', 'Experience', 'Vision', 'Impact', 'Profile', 
                'Nominator Name', 'Nominator Email', 'References', 'Photo URL', 'Date'
            ];
        } else {
            headers = ['S No', 'Reg No', 'Name', 'Email', 'Phone', 'Category', 'Nomination', 'Date'];
        }

        const csvRows = [
            headers.join(','), // Header row
            ...registrations.map((reg, index) => {
                if (isStudent) {
                    return [
                        index + 1,
                        `"${reg.register_number || reg.id || ''}"`,
                        `"${reg.student_name || ''} ${reg.last_name || ''}"`,
                        `"${reg.grade || ''}"`,
                        `"${reg.email || ''}"`,
                        `"${reg.phone || ''}"`,
                        `"${reg.school_name || ''}"`,
                        `"${reg.school_city || ''}"`,
                        `"${reg.school_phone || ''}"`,
                        `"${reg.school_email || ''}"`,
                        `"${(reg.business_idea || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${reg.total_members || ''}"`,
                        `"${reg.pitch_deck_path ? 'https://new.ssvmtransformingindia.com/public/registrations/' + reg.pitch_deck_path : ''}"`,
                        `"${new Date(reg.created_at).toLocaleDateString()}"`
                    ].join(',');
                } else if (isGuru) {
                    return [
                        index + 1,
                        `"${reg.register_number || reg.id || ''}"`,
                        `"${reg.student_name || ''} ${reg.last_name || ''}"`,
                        `"${reg.email || ''}"`,
                        `"${reg.phone || ''}"`,
                        `"${reg.school_name || ''}"`,
                        `"${reg.subjects || ''}"`,
                        `"${reg.experience || ''}"`,
                        `"${(reg.vision || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${(reg.impact || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${(reg.teacher_profile || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${reg.nominator_name || ''}"`,
                        `"${reg.nominator_email || ''}"`,
                        `"${(reg.references || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${reg.photo_path ? 'https://new.ssvmtransformingindia.com/public/registrations/' + reg.photo_path : ''}"`,
                        `"${new Date(reg.created_at).toLocaleDateString()}"`
                    ].join(',');
                } else {
                    return [
                        index + 1,
                        `"${reg.register_number || reg.id || ''}"`,
                        `"${reg.student_name || ''} ${reg.last_name || ''}"`,
                        `"${reg.email || ''}"`,
                        `"${reg.phone || ''}"`,
                        `"${reg.award_group || ''}"`,
                        `"${reg.nomination_type || ''}"`,
                        `"${new Date(reg.created_at).toLocaleDateString()}"`
                    ].join(',');
                }
            })
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeCategory}_registrations_full_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                handleLogout={handleLogout}
            />

            <div className="main-wrapper">
                <header className="top-bar">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <i className={`bi ${isSidebarOpen ? 'bi-text-indent-left' : 'bi-list'}`}></i>
                    </button>
                    
                    <div className="top-bar-right">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input 
                                type="text" 
                                placeholder="Auto search records..." 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="user-profile-mini">
                            <div className="avatar">{user?.name?.charAt(0)}</div>
                            <div className="user-info">
                                <span className="name">{user?.name}</span>
                                <span className="role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content-area" ref={mainRef}>
                    <div className="welcome-section">
                        <h1>{activeCategory === 'overview' ? 'Dashboard Overview' : activeCategory.replace(/-/g, ' ').toUpperCase()}</h1>
                        <p>Found {totalRecords} total registrations.</p>
                    </div>

                    {activeCategory === 'settings' ? (
                        <SettingsView user={user} setUser={setUser} showToast={showToast} />
                    ) : (
                        <>
                            {activeCategory === 'overview' && (
                                <div className="stats-container">
                                    {[
                                        { label: 'Total Registrations', value: totalRecords, icon: 'bi-person-plus', color: '#000000', trend: '+100%' },
                                        { label: 'Guru Awards', value: 'Live', icon: 'bi-award', color: '#333333', trend: '' },
                                        { label: 'Studentpreneur', value: 'Live', icon: 'bi-mortarboard', color: '#666666', trend: '' }
                                    ].map((stat, i) => (
                                        <div key={i} className="stat-card-premium" ref={el => cardsRef.current[i] = el}>
                                            <div className="stat-card-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                                <i className={`bi ${stat.icon}`}></i>
                                            </div>
                                            <div className="stat-card-info">
                                                <span className="stat-label">{stat.label}</span>
                                                <div className="stat-row">
                                                    <span className="stat-value">{stat.value}</span>
                                                    <span className="stat-trend">{stat.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="dashboard-grid full-width">
                                <section className="table-section">
                                    <div className="section-header">
                                        <h2>{activeCategory === 'overview' ? 'Recent Registrations' : 'Inbound Details'}</h2>
                                        <div className="table-header-actions">
                                            <span className="records-count">{totalRecords} Records Found</span>
                                            <div className="action-buttons">
                                                <button className="export-btn" onClick={handleExport}>
                                                    <i className="bi bi-download"></i> Export CSV
                                                </button>
                                                <button className="view-all-btn" onClick={() => fetchRegistrations(activeCategory, currentPage, searchTerm)}>
                                                    <i className="bi bi-arrow-clockwise"></i> Refresh
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        {loading ? (
                                            <div className="loading-state">Updating records...</div>
                                        ) : (
                                            <table className="custom-table">
                                                <thead>
                                                    <tr>
                                                        <th>Nominee Name</th>
                                                        <th>Contact</th>
                                                        <th>Category</th>
                                                        <th>Nomination</th>
                                                        <th>File / Pitch Deck</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {registrations.map((reg, i) => (
                                                        <tr key={i}>
                                                            <td>
                                                                <div className="td-name">
                                                                    <div className="small-avatar">{(reg.studentName || reg.student_name || 'U').charAt(0)}</div>
                                                                    {reg.studentName || reg.student_name} {reg.lastName || reg.last_name}
                                                                </div>
                                                            </td>
                                                            <td>{reg.email}<br/><small>{reg.phone}</small></td>
                                                            <td>{reg.awardGroup || reg.award_group}</td>
                                                            <td><span className="status-pill reviewing">{reg.nominationType || reg.nomination_type}</span></td>
                                                            <td>
                                                                {(reg.pitch_deck_path || reg.pitchDeck) ? (
                                                                    <a href={`https://new.ssvmtransformingindia.com/public/registrations/${reg.pitch_deck_path || reg.pitchDeck}`} target="_blank" rel="noopener noreferrer" className="file-link">
                                                                        <i className="bi bi-file-earmark-pdf"></i> View Deck
                                                                    </a>
                                                                ) : (reg.photo_path || reg.photo) ? (
                                                                    <a href={`https://new.ssvmtransformingindia.com/public/registrations/${reg.photo_path || reg.photo}`} target="_blank" rel="noopener noreferrer" className="file-link">
                                                                        <i className="bi bi-person-bounding-box"></i> View Photo
                                                                    </a>
                                                                ) : (
                                                                    <span className="no-file">No File</span>
                                                                )}
                                                            </td>
                                                            <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                    {registrations.length === 0 && (
                                                        <tr>
                                                            <td colSpan="6">
                                                                <div className="no-records">
                                                                    <i className="bi bi-folder-x"></i>
                                                                    <p>No records match your search criteria.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>

                                    {/* Pagination Controls */}
                                    {lastPage > 1 && (
                                        <div className="pagination-wrapper">
                                            <div className="pag-left">
                                                <button 
                                                    disabled={currentPage === 1} 
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    className="pag-btn prev-next"
                                                >
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </div>
                                            
                                            <div className="pag-numbers">
                                                {[...Array(lastPage)].map((_, i) => {
                                                    const pageNum = i + 1;
                                                    // Show first, last, current, and pages around current
                                                    if (
                                                        pageNum === 1 || 
                                                        pageNum === lastPage || 
                                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button 
                                                                key={pageNum}
                                                                className={`pag-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNum === currentPage - 2 || 
                                                        pageNum === currentPage + 2
                                                    ) {
                                                        return <span key={pageNum} className="pag-dots">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <div className="pag-right">
                                                <button 
                                                    disabled={currentPage === lastPage} 
                                                    onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                                                    className="pag-btn prev-next"
                                                >
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast-message ${toast.type}`}>
                        <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`}></i>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
