const express = require("express");
const { v4: uuidv4 } = require("uuid");
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to get supabase
const getSupabase = (req) => req.app.locals.supabase;

/**
 * Save or update a remark for a submission
 * POST /api/remarks
 * Body: { submissionId, remark }
 */
router.post("/remarks", async (req, res) => {
  try {
    const { submissionId, remark } = req.body;

    if (!submissionId) {
      return res.status(400).json({ 
        success: false, 
        message: "submissionId is required" 
      });
    }

    const supabase = getSupabase(req);

    // Verify the submission exists
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("id, mentee_id, project_id")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({ 
        success: false, 
        message: "Submission not found" 
      });
    }

    // Update the submission with the remark
    const { data: updatedSubmission, error: updateError } = await supabase
      .from("submissions")
      .update({ 
        remark: remark?.trim() || null,
        remark_updated_at: new Date().toISOString()
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating remark:", updateError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to save remark",
        error: updateError.message
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Remark saved successfully",
      data: updatedSubmission
    });
  } catch (err) {
    console.error("Save remark error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while saving remark",
      error: err.message
    });
  }
});

/**
 * Get remarks for a project (for mentees)
 * GET /api/remarks/:projectId
 */
router.get("/remarks/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const supabase = getSupabase(req);

    // Get all submissions with remarks for this project
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("id, stage_key, remark, remark_updated_at, mentee_id")
      .eq("project_id", projectId)
      .not("remark", "is", null);

    if (error) {
      console.error("Error fetching remarks:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch remarks" 
      });
    }

    return res.json({ 
      success: true, 
      data: submissions || [] 
    });
  } catch (err) {
    console.error("Fetch remarks error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch remarks" 
    });
  }
});

/**
 * Mark a remark as read
 * POST /api/remarks/:submissionId/read
 */
router.post("/remarks/:submissionId/read", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { menteeId } = req.body;

    if (!menteeId) {
      return res.status(400).json({ 
        success: false, 
        message: "menteeId is required" 
      });
    }

    const supabase = getSupabase(req);

    // Verify submission exists
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("id, mentee_id")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({ 
        success: false, 
        message: "Submission not found" 
      });
    }

    // Verify the menteeId matches
    if (submission.mentee_id !== menteeId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to mark this remark as read" 
      });
    }

    // Insert or update the remark_reads record
    const { data: remarkRead, error: insertError } = await supabase
      .from("remark_reads")
      .upsert({
        submission_id: submissionId,
        mentee_id: menteeId,
        read_at: new Date().toISOString()
      }, {
        onConflict: 'submission_id,mentee_id'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error marking remark as read:", insertError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to mark remark as read",
        error: insertError.message
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Remark marked as read",
      data: remarkRead
    });
  } catch (err) {
    console.error("Mark remark as read error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while marking remark as read",
      error: err.message
    });
  }
});

/**
 * Get unread remarks count for a mentee
 * GET /api/remarks/unread/count?menteeId=xxx&projectId=xxx
 */
router.get("/remarks/unread/count", async (req, res) => {
  try {
    const { menteeId, projectId } = req.query;

    if (!menteeId) {
      return res.status(400).json({ 
        success: false, 
        message: "menteeId is required" 
      });
    }

    const supabase = getSupabase(req);

    // Call the database function
    const { data, error } = await supabase
      .rpc('get_unread_remarks_count', { 
        p_mentee_id: menteeId,
        p_project_id: projectId || null
      });

    if (error) {
      console.error("Error getting unread count:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to get unread remarks count",
        error: error.message
      });
    }

    return res.json({ 
      success: true, 
      count: data || 0
    });
  } catch (err) {
    console.error("Get unread count error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to get unread remarks count",
      error: err.message
    });
  }
});

/**
 * Check if a specific remark is unread
 * GET /api/remarks/:submissionId/unread?menteeId=xxx
 */
router.get("/remarks/:submissionId/unread", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { menteeId } = req.query;

    if (!menteeId) {
      return res.status(400).json({ 
        success: false, 
        message: "menteeId is required" 
      });
    }

    const supabase = getSupabase(req);

    // Call the database function
    const { data, error } = await supabase
      .rpc('is_remark_unread', { 
        p_submission_id: submissionId,
        p_mentee_id: menteeId
      });

    if (error) {
      console.error("Error checking if remark is unread:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to check remark status",
        error: error.message
      });
    }

    return res.json({ 
      success: true, 
      isUnread: data || false
    });
  } catch (err) {
    console.error("Check unread error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to check remark status",
      error: err.message
    });
  }
});

module.exports = router;
