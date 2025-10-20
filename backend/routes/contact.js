const express = require("express");
const router = express.Router();

// Get supabase from app.locals (set in server.js)
const getSupabase = (req) => req.app.locals.supabase;

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const supabase = getSupabase(req);
    if (!supabase) {
      return res.status(500).json({ success: false, message: "Database connection not available" });
    }

    const { error } = await supabase
      .from("contacts")
      .insert([{ name, email, message, created_at: new Date().toISOString() }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ success: false, message: "Failed to submit contact form" });
    }

    res.json({ success: true, message: "Message successfully received!" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Admin endpoint to get all contacts
router.get("/admin/contacts", async (req, res) => {
  try {
    const supabase = getSupabase(req);
    if (!supabase) {
      return res.status(500).json({ success: false, message: "Database connection not available" });
    }

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
