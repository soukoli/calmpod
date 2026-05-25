import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping email send");
      return Response.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          firstName: name,
          audienceId,
        });
      } catch (audienceErr) {
        console.warn("Audience add warning:", audienceErr);
      }
    }

    const contactEmail = process.env.CONTACT_EMAIL || "support@calmpod.cz";

    const { error } = await resend.emails.send({
      from: "CalmPod <noreply@calmpod.cz>",
      to: contactEmail,
      replyTo: email,
      subject: `CalmPod kontakt: ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
