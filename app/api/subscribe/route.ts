import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validation
    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping subscribe");
      return Response.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Add to Waitlist audience
    const audienceId = process.env.RESEND_AUDIENCE_WAITLIST_ID;
    if (!audienceId) {
      console.warn("RESEND_AUDIENCE_WAITLIST_ID not set — skipping audience add");
      return Response.json({ success: true });
    }

    await resend.contacts.create({
      email: email,
      audienceId: audienceId,
    });

    return Response.json({ success: true });
  } catch (err: unknown) {
    // Duplicate contact is not an error for us
    if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 409) {
      return Response.json({ success: true });
    }

    console.error("Subscribe API error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
