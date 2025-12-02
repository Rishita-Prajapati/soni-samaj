import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { memberService } from '../../supabase/services/memberService';
import './MemberManagement.css';
import './AdminButtonFixes.css';

const MemberManagement = ({ admin, onLogout }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [currentPage, statusFilter]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const result = await memberService.getAllMembers(currentPage, 20, statusFilter);
      if (result.success) {
        setMembers(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMembers();
      return;
    }
    
    setLoading(true);
    try {
      const result = await memberService.searchMembers(searchTerm);
      if (result.success) {
        setMembers(result.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error searching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const result = await memberService.approveMember(id);
      if (result.success) {
        loadMembers();
        alert('Member approved successfully!');
      }
    } catch (error) {
      alert('Error approving member: ' + error.message);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this member?')) {
      try {
        const result = await memberService.rejectMember(id);
        if (result.success) {
          loadMembers();
          alert('Member rejected successfully!');
        }
      } catch (error) {
        alert('Error rejecting member: ' + error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const result = await memberService.deleteMember(id);
        if (result.success) {
          loadMembers();
          alert('Member deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting member: ' + error.message);
      }
    }
  };

  const viewMemberDetails = async (id) => {
    try {
      const result = await memberService.getMemberById(id);
      if (result.success) {
        setSelectedMember(result.data);
        setShowDetails(true);
      }
    } catch (error) {
      alert('Error loading member details: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#fbbf24', bg: '#fef3c7', text: 'Pending' },
      approved: { color: '#10b981', bg: '#d1fae5', text: 'Approved' },
      rejected: { color: '#ef4444', bg: '#fee2e2', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span 
        style={{
          color: config.color,
          backgroundColor: config.bg,
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="members">
      <div className="member-management">
        <div className="page-header">
          <h1>👥 Member Management</h1>
          <p>Manage community member registrations and profiles</p>
        </div>

        {/* Filters and Search */}
        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, mobile, or father's name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>🔍 Search</button>
          </div>
          
          <div className="filter-section">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="members-table-container">
          {loading ? (
            <div className="loading">Loading members...</div>
          ) : (
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Mobile</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {member.profile_image_url ? (
                            <img
                              src={member.profile_image_url}
                              alt={member.full_name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>👤</span>
                          )}
                        </div>
                        <div>
                          <strong>{member.full_name}</strong>
                          <small>{member.gender} • {member.marital_status}</small>
                        </div>
                      </div>
                    </td>
                    <td>{member.father_name}</td>
                    <td>
                      <div>
                        <div>{member.mobile_number}</div>
                        <small>WA: {member.whatsapp_number}</small>
                      </div>
                    </td>
                    <td>{member.district}</td>
                    <td>{getStatusBadge(member.registration_status)}</td>
                    <td>{new Date(member.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => viewMemberDetails(member.id)}
                          className="btn-view"
                          title="View Details"
                        >
                          👁️
                        </button>
                        {member.registration_status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(member.id)}
                              className="btn-approve"
                              title="Approve"
                            >
                              ✅
                            </button>
                            <button 
                              onClick={() => handleReject(member.id)}
                              className="btn-reject"
                              title="Reject"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Member Details Modal */}
        {showDetails && selectedMember && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>👤 Member Details</h2>
                <button onClick={() => setShowDetails(false)}>✕</button>
              </div>
              
              <div className="member-details">
                {selectedMember.profile_image_url && (
                  <div className="detail-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                      src={selectedMember.profile_image_url}
                      alt={selectedMember.full_name}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #e5e7eb'
                      }}
                    />
                  </div>
                )}
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div><strong>Full Name:</strong> {selectedMember.full_name}</div>
                    <div><strong>Father's Name:</strong> {selectedMember.father_name}</div>
                    <div><strong>Mother's Name:</strong> {selectedMember.mother_name}</div>
                    <div><strong>Date of Birth:</strong> {new Date(selectedMember.date_of_birth).toLocaleDateString()}</div>
                    <div><strong>Gender:</strong> {selectedMember.gender}</div>
                    <div><strong>Marital Status:</strong> {selectedMember.marital_status}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div><strong>Mobile:</strong> {selectedMember.mobile_number}</div>
                    <div><strong>WhatsApp:</strong> {selectedMember.whatsapp_number}</div>
                    <div><strong>Email:</strong> {selectedMember.email || 'Not provided'}</div>
                    <div><strong>Address:</strong> {selectedMember.current_address}</div>
                    <div><strong>District:</strong> {selectedMember.district}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Other Details</h3>
                  <div className="detail-grid">
                    <div><strong>Gotra:</strong> {selectedMember.gotra_self}</div>
                    <div><strong>Qualification:</strong> {selectedMember.qualification}</div>
                    <div><strong>Blood Group:</strong> {selectedMember.blood_group}</div>
                    <div><strong>Occupation:</strong> {selectedMember.job_or_business}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Religious Information</h3>
                  <div className="detail-grid">
                    <div><strong>Satimata Place:</strong> {selectedMember.satimata_place}</div>
                    <div><strong>Bheruji Place:</strong> {selectedMember.bheruji_place}</div>
                    <div><strong>Kuldevi Place:</strong> {selectedMember.kuldevi_place}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Registration Info</h3>
                  <div className="detail-grid">
                    <div><strong>Status:</strong> {getStatusBadge(selectedMember.registration_status)}</div>
                    <div><strong>Registered:</strong> {new Date(selectedMember.created_at).toLocaleString()}</div>
                    <div><strong>Last Updated:</strong> {new Date(selectedMember.updated_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {selectedMember.registration_status === 'pending' && (
                  <>
                    <button 
                      onClick={() => {
                        handleApprove(selectedMember.id);
                        setShowDetails(false);
                      }}
                      className="btn-approve"
                    >
                      ✅ Approve Member
                    </button>
                    <button 
                      onClick={() => {
                        handleReject(selectedMember.id);
                        setShowDetails(false);
                      }}
                      className="btn-reject"
                    >
                      ❌ Reject Member
                    </button>
                  </>
                )}
                <button onClick={() => setShowDetails(false)} className="btn-close">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MemberManagement;