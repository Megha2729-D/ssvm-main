import React, { useState } from 'react';

const SettingsView = ({ user, setUser, showToast }) => {
    const [profileName, setProfileName] = useState(user?.name || '');
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('https://new.ssvmtransformingindia.com/public/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name: profileName })
            });
            const result = await response.json();
            if (result.success) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
                showToast('Profile updated successfully!');
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Update profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('https://new.ssvmtransformingindia.com/public/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });
            const result = await response.json();
            if (result.success) {
                showToast('Password updated successfully!');
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Update password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-grid">
            {/* Profile Section */}
            <div className="settings-card">
                <h3>General Settings</h3>
                <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={profileName} 
                            onChange={(e) => setProfileName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address (Read-only)</label>
                        <input 
                            type="email" 
                            value={user?.email} 
                            readOnly 
                            className="bg-disabled" 
                        />
                        <small className="help-text text-danger">Email cannot be changed for security reasons.</small>
                    </div>
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="settings-card">
                <h3>Security Settings</h3>
                <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input 
                            type="password" 
                            value={passwordData.current_password} 
                            onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.new_password} 
                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.new_password_confirmation} 
                            onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})} 
                            required 
                        />
                    </div>
                    <button type="submit" className="save-btn danger" disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsView;
