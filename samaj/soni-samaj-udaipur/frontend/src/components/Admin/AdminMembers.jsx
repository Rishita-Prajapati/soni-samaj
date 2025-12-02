import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import memberService from '../../services/memberService';

const AdminMembers = ({ admin, onLogout }) => {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);

  useEffect(() => {
    loadMembers();
    loadStats();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const membersData = await memberService.getAllMembers();
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await memberService.getMemberStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusUpdate = async (memberId, newStatus) => {
    try {
      await memberService.updateMemberStatus(memberId, newStatus, admin?.uid);
      await loadMembers();
      await loadStats();
      alert(`Member ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Error updating member status');
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to delete ${memberName}? This action cannot be undone.`)) {
      try {
        await memberService.deleteMember(memberId);
        // Immediately update UI state
        setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
        // Reload stats
        await loadStats();
        alert('Member deleted successfully!');
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member');
      }
    }
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    if (filter === 'all') return true;
    return member.registration_status === filter;
  });

  // Pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout} currentModule="members">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
            <div>Loading members...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="members">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            👥 Members Management
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Manage member registrations and approvals • Total Members: {stats.total}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { key: 'total', label: 'Total Members', color: '#3b82f6', icon: '👥' },
            { key: 'pending', label: 'Pending', color: '#f59e0b', icon: '⏳' },
            { key: 'approved', label: 'Approved', color: '#10b981', icon: '✅' },
            { key: 'rejected', label: 'Rejected', color: '#ef4444', icon: '❌' }
          ].map(stat => (
            <div
              key={stat.key}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: `2px solid ${stat.color}`,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
                {stats[stat.key]}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Members' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: filter === tab.key ? '#3b82f6' : '#f3f4f6',
                color: filter === tab.key ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {tab.label} ({filter === tab.key ? filteredMembers.length : 
                tab.key === 'all' ? stats.total : stats[tab.key]})
            </button>
          ))}
        </div>

        {/* Members Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {currentMembers.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Member</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Location</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Registered</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((member, index) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {member.profile_picture_url && (
                              <img
                                src={member.profile_picture_url}
                                alt={member.full_name}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: '500', color: '#1f2937' }}>{member.full_name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Father: {member.father_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            📱 {member.mobile_number}
                          </div>
                          {member.email && (
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              ✉️ {member.email}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            📍 {member.district}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {member.area_locality}
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: `${getStatusColor(member.registration_status)}20`,
                            color: getStatusColor(member.registration_status),
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {member.registration_status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                          {new Date(member.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {member.registration_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(member.id, 'approved')}
                                  style={{
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                  style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  ❌ Reject
                                </button>
                              </>
                            )}
                            {member.registration_status !== 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(member.id, 'pending')}
                                style={{
                                  backgroundColor: '#f59e0b',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                🔄 Reset
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMember(member.id, member.full_name)}
                              style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '20px'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: currentPage === i + 1 ? '#3b82f6' : 'white',
                        color: currentPage === i + 1 ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Members Found</h3>
              <p>No members match the current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMembers;