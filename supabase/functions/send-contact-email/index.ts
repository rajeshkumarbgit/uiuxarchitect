import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Where contact form submissions are delivered. Override with a secret
// named CONTACT_TO_EMAIL; otherwise fall back to the portfolio owner's
// email baked into the site config.
const TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL") ?? "rajesh.kumar@design.com";
const FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") ?? "portfolio@rajeshkumar.design";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
}

function validatePayload(body: unknown): body is ContactPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" && b.name.trim().length > 0 &&
    typeof b.email === "string" && b.email.trim().length > 0 &&
    typeof b.message === "string" && b.message.trim().length > 0 &&
    (b.company === undefined || typeof b.company === "string")
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    if (!validatePayload(body)) {
      return new Response(JSON.stringify({ error: "Invalid form data. Name, email, and message are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, company, message } = body;

    // Persist to the database using the service role key (bypasses RLS).
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({ name, email, company: company ?? null, message });

    if (insertError) {
      console.error("DB insert failed:", insertError.message);
      return new Response(JSON.stringify({ error: "Could not save your message. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Attempt to send an email notification. If no API key is configured we
    // still succeed (the message is safely stored in the database).
    let emailSent = false;
    if (RESEND_API_KEY) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          subject: `New contact form message from ${name}`,
          reply_to: email,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Company: ${company || "—"}`,
            "",
            "Message:",
            message,
          ].join("\n"),
          html: [
            `<h3>New contact form submission</h3>`,
            `<p><strong>Name:</strong> ${name}</p>`,
            `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`,
            `<p><strong>Company:</strong> ${company || "—"}</p>`,
            `<p><strong>Message:</strong></p>`,
            `<p>${message.replace(/\n/g, "<br>")}</p>`,
          ].join(""),
        }),
      });
      emailSent = emailRes.ok;
      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Email send failed:", errText);
      }
    } else {
      console.warn("RESEND_API_KEY not set; message stored in DB only.");
    }

    return new Response(JSON.stringify({
      success: true,
      stored: true,
      emailSent,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
