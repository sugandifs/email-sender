import { Template, Colors, Callout } from "@/types";

export function generateEmailHTML(
  template: Template,
  colors: Colors,
  callout: Callout,
  bannerImage: File | null,
): string {
  const imageTag = bannerImage
    ? `<img src="${URL.createObjectURL(bannerImage)}" alt="Banner Image" style="display: block; max-width: 200px; height: auto; margin: 0 auto 15px auto; border-radius: 8px;">`
    : `<div style="width: 200px; height: 100px; background: ${colors.accent}; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; color: ${colors.text}; font-size: 14px;">Placeholder Banner Image</div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0;">
<div style="font-family: 'Open Sans', sans-serif; max-width: 600px; margin: 0 auto; background: ${colors.background}; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="padding: 30px; text-align: center; background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});">
    ${imageTag}
  </div>

  <div style="padding: 30px; color: ${colors.text}; line-height: 1.7; letter-spacing: 0.3px;">
    <div style="font-size: 26px; font-weight: 700; margin-bottom: 20px; color: ${colors.primary}; letter-spacing: -0.5px;">${template.mainHeading}</div>
    <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 400;">${template.introText}</p>
    <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 400;">${template.eventDetails}</p>
    <ul style="padding-left: 20px; margin: 20px 0; font-size: 15px;">
      ${template.bulletPoints.map((point) => `<li style="margin-bottom: 12px; line-height: 1.6; font-weight: 400;">${point}</li>`).join("")}
    </ul>

    ${
      callout.enabled
        ? `
    <div style="background: ${callout.backgroundColor}; border: 3px solid ${callout.borderColor}; border-radius: 12px; padding: 25px; margin: 25px 0; color: ${callout.textColor};">
      <div style="font-size: 20px; font-weight: 700; margin-bottom: 15px; letter-spacing: -0.3px;">
        <p style="margin: 0;"><strong>${callout.heading}</strong></p>
      </div>
      <div style="font-size: 15px; line-height: 1.6; font-weight: 400;">${callout.content}</div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${callout.buttonLink}" style="background: ${callout.buttonColor}; color: ${callout.buttonTextColor}; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">
          ${callout.buttonText}
        </a>
      </div>
    </div>
    `
        : ""
    }

    <p style="margin: 20px 0 0 0; font-size: 15px; font-weight: 400;">${template.closingText}</p>
  </div>

  <div style="background: ${colors.accent}; padding: 25px; text-align: center; color: ${colors.text};">
    <div style="font-size: 16px; margin-bottom: 10px; font-weight: 600; letter-spacing: 0.2px;">${template.signature}</div>
    <div style="font-weight: 700; margin-bottom: 15px; font-size: 15px; letter-spacing: 0.3px;">${template.team}</div>
    <div style="font-size: 14px; line-height: 1.8; font-weight: 400;">
      <strong style="font-weight: 600;">Contact us</strong><br>
      <a href="mailto:${template.contactEmail}" style="color: ${colors.text}; text-decoration: none;">${template.contactEmail}</a><br>
      <a href="https://instagram.com/${template.instagram.replace("@", "")}" target="_blank" style="color: ${colors.text}; text-decoration: none;">Instagram: ${template.instagram}</a>
    </div>
  </div>
</div>
</body>
</html>`;
}
