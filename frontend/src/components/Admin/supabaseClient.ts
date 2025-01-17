import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://jeogvldsliewwsyvfnqk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2d2bGRzbGlld3dzeXZmbnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMDMwMDksImV4cCI6MjA1MjU3OTAwOX0.c0d6AItUT5emPs9aAxyq93BFsJMbf_Fw-7xVQP_vWM0";

export const supabase = createClient(supabaseUrl, supabaseKey);
