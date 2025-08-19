import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './incubationDetails.css';
import { 
  getIncubationCenterByName, 
  getCommentsByCenterId, 
  addComment, 
  deleteComment,
  getAllApprovedCenters
} from './services/incubationService';

// Function to convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1];
  }
  
  // Remove any additional parameters
  if (videoId.includes('&')) {
    videoId = videoId.split('&')[0];
  }
  
  return `https://www.youtube.com/embed/${videoId}`;
};

// Generate browser session ID for user identification
const generateBrowserSessionId = () => {
  let sessionId = localStorage.getItem('browser_session_id');
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8; // Added parentheses here
      return v.toString(16);
    });
    localStorage.setItem('browser_session_id', sessionId);
  }
  return sessionId;
};

// Mock data for fallback when Supabase is not configured
const mockIncubationCenters = [
  {
    id: 1,
    company_name: "Technology Transfer Office (UBL Cell) University of Sri Jayewardenepura",
    location: "Sri Lanka",
    domain: "Agnostic",
    incubation_center_type: "Incubation center",
    services: "Hybrid",
    startups_incubated: "50+",
    support_remuneration: "Equity based",
    incubation_description: "Our UBL Cell stands out as a unique incubation center by seamlessly integrating academic research with real-world industry applications. Its USP lies in its strong university–industry linkage, enabling early-stage innovators—especially students and researchers—to transform their scientific ideas into market-ready solutions.",
    unique_selling_point: "Strong university-industry linkage with academic research integration.",
    company_email: "contact@usjp.ac.lk",
    company_website: "https://usjp.ac.lk",
    youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    logo_url: "https://static.wixstatic.com/media/0556b8_e0fff23992724c7087785a7908a6998b~mv2.png",
    is_approved: false
  },
  {
    id: 2,
    company_name: "Skolkovo Innovation Center",
    location: "Russian Federation",
    domain: "Agnostic",
    incubation_center_type: "Accelerator",
    services: "Onsite",
    startups_incubated: "5000+",
    support_remuneration: "Fee based",
    incubation_description: "Skolkovo Innovation Center is the largest innovation ecosystem in Russia, home to over 5,000 high-tech startups across key sectors such as IT, biomedicine, energy, advanced manufacturing, and space.",
    unique_selling_point: "Largest innovation ecosystem in Russia with government backing.",
    company_email: "contact@skolkovo.ru",
    company_website: "https://skolkovo.ru",
    youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    logo_url: "https://static.wixstatic.com/media/8d3771_dfaae21a034146c4987059be4b93105d~mv2.png",
    is_approved: false
  },
  {
    id: 3,
    company_name: "BUILD UP LABS",
    location: "Portugal",
    domain: "Artificial Intelligence / SAAS",
    incubation_center_type: "Incubation center",
    services: "Remote",
    startups_incubated: "25+",
    support_remuneration: "Hybrid (equity + fee)",
    incubation_description: "BUILD UP LABS provides remote-first incubation support, leveraging the experience of serial entrepreneurs to guide new entrepreneurs through their startup journey.",
    unique_selling_point: "Remote-first incubation support, by Serial-Entrepreneurs for New Entrepreneurs",
    company_email: "contact@builduplabs.com",
    company_website: "https://builduplabs.com",
    youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    logo_url: "/imageslogo/builduplabs.png",
    is_approved: false
  },
  {
    id: 142,
    company_name: "AIC-RNTU Foundation",
    location: "India",
    domain: "Agnostic",
    incubation_center_type: "Incubation center",
    services: "Hybrid",
    startups_incubated: "50+",
    support_remuneration: "Equity based",
    incubation_description: "AIC-RNTU Foundation is central India's leading sector-agnostic incubation center focused on early-stage startups. We provide comprehensive support through multiple government schemes, holistic development programs, extensive networks, expert mentoring, and curated programs designed to accelerate startup growth and success.",
    unique_selling_point: "We are central India's Leading Sector Agnostic Incubation center focused on Early stage startups with Multiple Govt. schemes support for startups to holistic development with networks, mentoring and curated programs",
    company_email: "contact@aic-rntu.org",
    company_website: "https://aic-rntu.org",
    youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    logo_url: "https://static.wixstatic.com/media/c5dc99_3f2a792fabe24746b2635a1287e2f075~mv2.png",
    is_approved: false 
  }
];

export default function IncubationDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Generate browser session ID for this user
  const browserSessionId = generateBrowserSessionId();

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true);
        
        // Decode the URL parameter and convert back to company name
        const decodedName = decodeURIComponent(name);
        const companyName = decodedName.replace(/-/g, ' ');
        
        // Try to fetch from Supabase first
        let centerData = null;
        let nameVariations = [];
        try {
          // Try multiple variations of the company name
          nameVariations = [
            companyName,
            companyName.replace(/\s+/g, ' ').trim(), // Normalize spaces
            decodedName.replace(/-/g, ' ').toLowerCase(), // Lowercase version
            decodedName.replace(/-/g, ' ').toUpperCase(), // Uppercase version
            decodedName.replace(/-/g, ''), // Remove all hyphens
            decodedName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim(), // Normalized version
            // Special handling for AIC-RNTU Foundation
            companyName.toLowerCase().includes('aic-rntu') ? 'AIC-RNTU Foundation' : null,
            companyName.toLowerCase().includes('aic rntu') ? 'AIC-RNTU Foundation' : null
          ].filter(Boolean); // Remove null values
          
          for (const variation of nameVariations) {
            try {
              centerData = await getIncubationCenterByName(variation);
              if (centerData) break; // Found a match
            } catch (error) {
              console.log(`Tried variation "${variation}": ${error.message}`);
              continue; // Try next variation
            }
          }
        } catch (supabaseError) {
          console.log('Supabase not configured, using mock data');
        }
        
        // Debug: Log all approved centers to help identify the issue
        try {
          const allCenters = await getAllApprovedCenters();
          console.log('All approved centers in database:', allCenters);
          console.log('Looking for company name variations:', nameVariations);
        } catch (debugError) {
          console.log('Debug: Could not fetch all centers');
        }
        
        // If Supabase fails or returns null, use mock data
        if (!centerData) {
          centerData = mockIncubationCenters.find(center => {
            const centerNameLower = center.company_name.toLowerCase();
            const searchNameLower = companyName.toLowerCase();
            
            // Exact match
            if (centerNameLower === searchNameLower) return true;
            
            // Special handling for AIC-RNTU Foundation
            if (searchNameLower.includes('aic-rntu') || searchNameLower.includes('aic rntu')) {
              return centerNameLower.includes('aic-rntu foundation');
            }
            
            // Partial match
            return centerNameLower.includes(searchNameLower) || searchNameLower.includes(centerNameLower);
          });
        }
        
        // If center is not found in mock data, create a basic center object
        // This ensures all centers show "Details Coming Soon" instead of "Center Not Found"
        if (!centerData) {
          centerData = {
            id: Date.now(), // Temporary ID
            company_name: companyName,
            location: "Location to be updated",
            domain: "Domain to be updated",
            incubation_center_type: "Incubation center",
            services: "Services to be updated",
            startups_incubated: "To be updated",
            support_remuneration: "To be updated",
            incubation_description: "Description will be uploaded soon.",
            unique_selling_point: "USP will be uploaded soon.",
            company_email: "contact@example.com",
            company_website: "#",
            youtube_link: "",
            logo_url: "",
            is_approved: false // This ensures "Details Coming Soon" message
          };
        }

        setCenter(centerData);
        
        // Try to fetch comments from Supabase, but don't fail if it's not configured
        try {
          const commentsData = await getCommentsByCenterId(centerData.id);
          setComments(commentsData);
        } catch (commentsError) {
          console.log('Comments not available, using empty array');
          setComments([]);
        }
        
      } catch (err) {
        console.error('Error fetching center data:', err);
        setError('Failed to load center details');
      } finally {
        setLoading(false);
      }
    };

    fetchCenterData();
  }, [name]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim() || !center) return;

    try {
      setSubmitting(true);
      
      // Try to add comment to Supabase
      try {
        const commentData = await addComment(
          center.id, 
          newComment.name.trim(), 
          newComment.comment.trim(),
          browserSessionId
        );
        
        setComments([commentData, ...comments]);
      } catch (supabaseError) {
        // If Supabase fails, add comment locally (temporary)
        const tempComment = {
          id: Date.now(),
          author_name: newComment.name.trim(),
          comment_text: newComment.comment.trim(),
          browser_session_id: browserSessionId,
          created_at: new Date().toISOString()
        };
        
        setComments([tempComment, ...comments]);
        alert('Comment added locally (Supabase not configured)');
      }
      
      setNewComment({ name: '', comment: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Try to delete from Supabase first
      try {
        await deleteComment(commentId, browserSessionId);
      } catch (supabaseError) {
        console.log('Supabase not configured, deleting locally');
      }
      
      // Remove from local state
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. You can only delete your own comments.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setCommentToDelete(null);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if comment belongs to current user
  const canDeleteComment = (comment) => {
    return comment.browser_session_id === browserSessionId;
  };

  if (loading) {
    return (
      <div className="incubation-details-page">
        <div className="incubation-details-container">
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#FFD600',
            fontSize: '1.2rem'
          }}>
            Loading center details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="incubation-details-page">
        <div className="incubation-details-container">
          <div className="error-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h2>Error Loading Details</h2>
            <p>{error}</p>
            <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '20px', marginLeft: '0', alignSelf: 'center' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!center.is_approved) {
    return (
      <div className="incubation-details-page">
        <div className="incubation-details-container">
          <div className="error-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h2>Details Coming Soon</h2>
            <p>Details for this incubation center will be uploaded soon once the center fills the registration form and gets approved.</p>
            <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '20px', marginLeft: '0', alignSelf: 'center' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="incubation-details-page">
      <div className="incubation-details-container">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="back-to-home-btn"
        >
          ← Back to Facilitator Network
        </button>
        
        <div className="incubation-details-content">
          <div className="incubation-details-main">
            <div className="incubation-details-header">
            <h1>{center.company_name}</h1>
            <div className="incubation-details-company">
              <span>{center.incubation_center_type}</span>
              <span className="separator">•</span>
                <span className="location">
                  <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                {center.location}
                </span>
              </div>
            <div className="incubation-details-meta">
              <span>{center.domain}</span> | <span>{center.services}</span> | 
              <span className="incubation-type">
                <svg className="incubation-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                {center.incubation_center_type}
              </span> | <span>{center.support_remuneration}</span>
            </div>
            <div className="incubation-salary">
              <span className="salary-value">Startups Incubated: {center.startups_incubated}</span>
            </div>
          </div>
          
          <section className="incubation-details-section">
            <h2>Incubation Description</h2>
            <div className="incubation-description-text">
              {center.incubation_description}
            </div>
          </section>

          <section className="incubation-details-section">
            <h2>YouTube Video</h2>
            <div className="youtube-video-container">
              <iframe
                width="100%"
                height="315"
                src={getYouTubeEmbedUrl(center.youtube_link)}
                title="Incubation Center Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-iframe"
              ></iframe>
            </div>
          </section>

          <section className="incubation-details-section">
            <h2>Comments</h2>
            <div className="comments-section">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="comments-list">
                  {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author_name}</span>
                        <span className="comment-date">{formatDate(comment.created_at)}</span>
                        {canDeleteComment(comment) && (
                          <button 
                            className="delete-comment-btn"
                            onClick={() => confirmDelete(comment.id)}
                          >
                            Delete
                          </button>
                        )}
            </div>
                      <p className="comment-text">{comment.comment_text}</p>
        </div>
                  ))}
      </div>
              )}
              
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-input-group">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={newComment.name}
                    onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                    className="comment-name-input"
                  />
                </div>
                <div className="comment-input-group">
                  <textarea
                    placeholder="Write your comment..."
                    value={newComment.comment}
                    onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                    className="comment-text-input"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="post-comment-btn" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </form>
              </div>
          </section>
          
          <div className="incubation-details-actions">
            {/* <button className="apply-now-btn">
              Contact Center
            </button> */}
                </div>
              </div>
              
        <aside className="incubation-details-sidebar">
          <div className="company-logo-section">
            <img src={center.logo_url} alt={center.company_name + ' logo'} className="company-logo" />
          </div>
          <h2>About {center.company_name}</h2>
          
          <div className="incubation-description-text">
            {center.unique_selling_point}
          </div>
          
          <div className="incubation-details-sidebar-actions">
            <a href={center.company_website} target="_blank" rel="noopener noreferrer" className="sidebar-btn">
              Company Website
            </a>
            {/* <a href={`mailto:${center.company_email}`} className="sidebar-btn">
              Contact Company
            </a> */}
          </div>
          
          <div className="incubation-contact-info">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> <a href={`mailto:${center.company_email}`}>{center.company_email}</a></p>
            {/* <p><strong>Location:</strong> {center.location}</p>
            <p><strong>Domain:</strong> {center.domain}</p> */}
            {/* <p><strong>Services:</strong> {center.services}</p>
            <p><strong>Support Type:</strong> {center.support_remuneration}</p> */}
          </div>
        </aside>
                </div>
            </div>
            
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Delete Comment</h3>
            <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="delete-confirmation-actions">
              <button 
                className="cancel-delete-btn"
                onClick={cancelDelete}
              >
                  Cancel
                </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => handleDeleteComment(commentToDelete)}
              >
                Delete
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}