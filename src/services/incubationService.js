import { supabase, generateBrowserSessionId } from '../config/supabase';

// Upload logo to Supabase Storage
export const uploadLogo = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error } = await supabase.storage
      .from('incubation-logos')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('incubation-logos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw new Error('Failed to upload logo');
  }
};

// Submit new incubation center
export const submitIncubationCenter = async (formData, logoFile) => {
  try {
    let logoUrl = null;
    
    // Upload logo if provided
    if (logoFile) {
      logoUrl = await uploadLogo(logoFile);
    }

    // Prepare data for database
    const centerData = {
      company_name: formData.companyName,
      company_email: formData.companyEmail,
      company_website: formData.companyWebsite,
      unique_selling_point: formData.uniqueSellingPoint,
      incubation_center_type: formData.incubationCenterType,
      location: formData.location,
      domain: formData.domain,
      services: formData.services,
      startups_incubated: formData.startupsIncubated,
      support_remuneration: formData.supportRemuneration,
      youtube_link: formData.youtubeLink,
      incubation_description: formData.incubationDescription,
      logo_url: logoUrl,
      is_approved: false // Default to false, admin needs to approve
    };

    const { data, error } = await supabase
      .from('incubation_centers')
      .insert([centerData])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error submitting incubation center:', error);
    throw new Error('Failed to submit incubation center');
  }
};

// Get all approved incubation centers
export const getIncubationCenters = async () => {
  try {
    const { data, error } = await supabase
      .from('incubation_centers')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching incubation centers:', error);
    throw new Error('Failed to fetch incubation centers');
  }
};

// Get incubation center by ID
export const getIncubationCenterById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('incubation_centers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching incubation center:', error);
    throw new Error('Failed to fetch incubation center');
  }
};

// Get incubation center by company name (case-insensitive)
export const getIncubationCenterByName = async (companyName) => {
  try {
    // First try exact match with case-insensitive search
    let { data, error } = await supabase
      .from('incubation_centers')
      .select('*')
      .ilike('company_name', companyName)
      .eq('is_approved', true)
      .single();

    if (error && error.code === 'PGRST116') {
      // If exact match fails, try partial match
      const { data: partialData, error: partialError } = await supabase
        .from('incubation_centers')
        .select('*')
        .ilike('company_name', `%${companyName}%`)
        .eq('is_approved', true)
        .single();

      if (partialError) throw partialError;
      return partialData;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching incubation center by name:', error);
    return null; // Return null if not found
  }
};

// Get comments for a specific center
export const getCommentsByCenterId = async (centerId) => {
  try {
    const { data, error } = await supabase
      .from('comments_incubation')
      .select('*')
      .eq('center_id', centerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

// Add new comment
export const addComment = async (centerId, authorName, commentText, browserSessionId) => {
  try {
    const { data, error } = await supabase
      .from('comments_incubation')
      .insert([{
        center_id: centerId,
        author_name: authorName,
        comment_text: commentText,
        browser_session_id: browserSessionId
      }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

// Delete comment (only by the user who created it)
export const deleteComment = async (commentId, browserSessionId) => {
  try {
    const { data, error } = await supabase
      .from('comments_incubation')
      .delete()
      .eq('id', commentId)
      .eq('browser_session_id', browserSessionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
};

// Check if user can delete a comment
export const canDeleteComment = async (commentId) => {
  try {
    const browserSessionId = generateBrowserSessionId();

    const { data, error } = await supabase
      .from('comments_incubation')
      .select('browser_session_id')
      .eq('id', commentId)
      .single();

    if (error) throw error;

    return data.browser_session_id === browserSessionId;
  } catch (error) {
    console.error('Error checking comment ownership:', error);
    return false;
  }
};

// Debug function to list all approved incubation centers
export const getAllApprovedCenters = async () => {
  try {
    const { data, error } = await supabase
      .from('incubation_centers')
      .select('company_name, is_approved')
      .eq('is_approved', true);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all approved centers:', error);
    return [];
  }
}; 