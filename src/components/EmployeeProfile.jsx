import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        username: user.username,
        password: '',
        role: user.role
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      id: formData.id,
      name: formData.name,
      username: formData.username,
      role: formData.role
    };

    if (formData.password.trim()) {
      updateData.password = formData.password;
    }

    const response = await userService.updateUser(updateData);

    if (response.success) {
      setToast({ message: 'Profile updated successfully', type: 'success' });
      const updatedUser = { ...user, name: formData.name, username: formData.username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setFormData({ ...formData, password: '' });
    } else {
      setToast({ message: response.message || 'Failed to update profile', type: 'error' });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="employee-profile">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>My Profile</h2>

      <div className="profile-form-container">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email/Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProfile;
