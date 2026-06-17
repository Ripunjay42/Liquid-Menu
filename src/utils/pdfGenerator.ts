import { jsPDF } from "jspdf";
import { VENUES, COCKTAILS, CERTIFICATIONS, SKILLS, DIAGEO_CERTIFICATES } from "../data";

// Dimensions of A4 page in mm
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

// Colors
const COLOR_INK = "#0a0906";
const COLOR_PARCHMENT = "#e8dfc8";
const COLOR_GOLD = "#c9a84c";
const COLOR_GOLD_DIM = "#6b5520";
const COLOR_SMOKE = "#1e1b16";
const COLOR_ASH = "#3a342a";

export function generatePortfolioPDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Helper to draw clean header-footer guidelines matching Wallpaper* editorial style
  function drawPageBackground(docInstance: jsPDF, isDark: boolean = false) {
    if (isDark) {
      docInstance.setFillColor(10, 9, 6); // Ink (#0a0906)
      docInstance.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
    } else {
      docInstance.setFillColor(242, 239, 230); // Lighter Parchment
      docInstance.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
    }
  }

  function drawFooter(docInstance: jsPDF, pageNum: number, isDark: boolean = false) {
    const textCol = isDark ? COLOR_PARCHMENT : COLOR_INK;
    const lineCol = isDark ? COLOR_GOLD_DIM : COLOR_ASH;

    // Line above footer
    docInstance.setDrawColor(lineCol);
    docInstance.setLineWidth(0.15);
    docInstance.line(15, PAGE_HEIGHT - 20, PAGE_WIDTH - 15, PAGE_HEIGHT - 20);

    // Footer text
    docInstance.setFont("Helvetica", "normal");
    docInstance.setFontSize(8);
    docInstance.setTextColor(textCol);

    // Left
    docInstance.text("Hemakshe Nagaraj — Brand Advocate & Mixologist", 15, PAGE_HEIGHT - 13);
    // Center
    const pageStr = pageNum < 10 ? `0${pageNum}` : `${pageNum}`;
    docInstance.text(`${pageStr} / 10`, PAGE_WIDTH / 2, PAGE_HEIGHT - 13, { align: "center" });
    // Right
    docInstance.text("The Liquid Menu — Confidential Portfolio", PAGE_WIDTH - 15, PAGE_HEIGHT - 13, { align: "right" });
  }

  // --------------------------------------------------------------------------------
  // PAGE 1: COVER (Dark Luxury Aesthetic)
  // --------------------------------------------------------------------------------
  drawPageBackground(doc, true);

  // Decorative lines to mimic printed book plate
  doc.setDrawColor(COLOR_GOLD_DIM);
  doc.setLineWidth(0.2);
  doc.rect(8, 8, PAGE_WIDTH - 16, PAGE_HEIGHT - 16);

  // Internal borders
  doc.setDrawColor(COLOR_GOLD);
  doc.setLineWidth(0.4);
  doc.line(15, 60, PAGE_WIDTH - 15, 60);

  // Tagline
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_GOLD);
  doc.text("T H E   L I Q U I D   M E N U", PAGE_WIDTH / 2, 50, { align: "center" });

  // Name
  doc.setFont("Times", "italic");
  doc.setFontSize(36);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("Hemakshe Nagaraj", PAGE_WIDTH / 2, 85, { align: "center" });

  doc.setDrawColor(COLOR_GOLD);
  doc.setLineWidth(0.5);
  doc.line(40, 95, PAGE_WIDTH - 40, 95);

  // Subtitle / Role
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(COLOR_GOLD);
  doc.text("Brand Advocate & Mixologist, Bengaluru", PAGE_WIDTH / 2, 105, { align: "center" });

  // Quote / Philosophy block with warm backing card
  doc.setFillColor(30, 27, 22); // Smoke card
  doc.rect(20, 125, PAGE_WIDTH - 40, 35, "F");
  doc.setDrawColor(COLOR_GOLD_DIM);
  doc.setLineWidth(0.5);
  doc.line(23, 125, 23, 160); // Golden left accent rule

  doc.setFont("Times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(COLOR_PARCHMENT);
  const quoteText = doc.splitTextToSize("“I don't just make drinks. I control how a night feels — one glass at a time.”", PAGE_WIDTH - 55);
  doc.text(quoteText, 28, 140);

  // Credentials Counter grid
  doc.setFillColor(30, 27, 22); // smoke background
  doc.rect(15, 185, PAGE_WIDTH - 30, 48, "F");
  
  // Left Credential
  doc.setFont("Times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("7+", 40, 205, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("Years Experience", 40, 215, { align: "center" });

  // Center vertical divider
  doc.setDrawColor(COLOR_ASH);
  doc.setLineWidth(0.2);
  doc.line(78, 193, 78, 225);

  // Center Credential
  doc.setFont("Times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("15+", PAGE_WIDTH / 2, 205, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("Certifications", PAGE_WIDTH / 2, 215, { align: "center" });

  // Right vertical divider
  doc.line(132, 193, 132, 225);

  // Right Credential
  doc.setFont("Times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("5", 170, 205, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("Venues Shaped", 170, 215, { align: "center" });

  // Signature brand label at very bottom
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("BENGALURU, INDIA  ·  FINE COCKTAILS  ·  BRAND ADVOCACY", PAGE_WIDTH / 2, 262, { align: "center" });

  drawFooter(doc, 1, true);

  // --------------------------------------------------------------------------------
  // PAGE 2: ABOUT / PHILOSOPHY (Classic Printed Editorial Style - Parchment Background)
  // --------------------------------------------------------------------------------
  doc.addPage();
  drawPageBackground(doc, false);

  // Section Banner Title
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("0 2   —   T H E   A P E R I T I F", 15, 25);

  doc.setFont("Times", "italic");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("The Philosophy of Pour", 15, 34);

  // Left Column - Interactive Portrait Mockup Frame
  doc.setFillColor(201, 168, 76, 0.1); // Warm gold tint
  doc.rect(15, 50, 75, 110);
  doc.setDrawColor(COLOR_GOLD_DIM);
  doc.setLineWidth(0.3);
  doc.rect(15, 50, 75, 110);
  // Crosshairs for placeholder
  doc.setDrawColor(COLOR_ASH);
  doc.line(15, 50, 90, 160);
  doc.line(90, 50, 15, 160);
  // Box description text
  doc.setFillColor(242, 239, 230);
  doc.rect(20, 100, 65, 16, "F");
  doc.rect(20, 100, 65, 16, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(COLOR_INK);
  doc.text("PORTRAIT IMAGE", 52.5, 107, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("[ hemakshe_portrait.jpeg ]", 52.5, 112, { align: "center" });

  // Metric Cards Grid on the left beneath portrait
  doc.setFillColor(235, 230, 218);
  // Metric Card 1
  doc.rect(15, 172, 35, 25, "F");
  doc.setDrawColor(COLOR_ASH);
  doc.rect(15, 172, 35, 25, "S");
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_GOLD);
  doc.text("7+", 32.5, 181, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(COLOR_INK);
  doc.text("Years Behind Bar", 32.5, 189, { align: "center" });

  // Metric Card 2
  doc.rect(55, 172, 35, 25, "F");
  doc.rect(55, 172, 35, 25, "S");
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_GOLD);
  doc.text("15+", 72.5, 181, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Diageo Academy Modules", 72.5, 189, { align: "center" });

  // Metric Card 3
  doc.rect(15, 203, 35, 25, "F");
  doc.rect(15, 203, 35, 25, "S");
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_GOLD);
  doc.text("B.A.", 32.5, 212, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Psych · Lit · Journo", 32.5, 220, { align: "center" });

  // Metric Card 4
  doc.rect(55, 203, 35, 25, "F");
  doc.rect(55, 203, 35, 25, "S");
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_GOLD);
  doc.text("50+", 72.5, 212, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Private Events Curated", 72.5, 220, { align: "center" });

  // Right Column - The Story and Philosophy Content
  const storyX = 100;

  // Pull Quote
  doc.setFont("Times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_INK);
  const pullQuoteText = doc.splitTextToSize("“True brand advocacy is 50% what's in the glass — and 50% how you talk about it.”", PAGE_WIDTH - storyX - 15);
  doc.text(pullQuoteText, storyX + 4, 56);
  // left border accent
  doc.setDrawColor(COLOR_GOLD);
  doc.setLineWidth(0.6);
  doc.line(storyX, 50, storyX, 70);

  // Body copy
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(COLOR_INK);
  
  const para1 = "Seven years of high-volume, fine-dining, and private-event bartending have taught me that the most powerful thing behind any bar isn't technique — it's the story you tell with every pour.";
  const para2 = "With a background in Psychology, Literature, and Journalism, I bridge the gap between trade execution and consumer storytelling — crafting experiences that move product and build genuine loyalty.";

  const p1Wrapped = doc.splitTextToSize(para1, PAGE_WIDTH - storyX - 15);
  doc.text(p1Wrapped, storyX, 85);

  const p2Wrapped = doc.splitTextToSize(para2, PAGE_WIDTH - storyX - 15);
  doc.text(p2Wrapped, storyX, 125);

  // Skill tags section
  doc.setFont("Times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(COLOR_GOLD);
  doc.text("Core Competence Focus", storyX, 168);
  doc.line(storyX, 172, PAGE_WIDTH - 15, 172);

  let tagY = 180;
  const tagsList = ["Menu Engineering", "Brand Storytelling", "Trade Advocacy", "Team Leadership"];
  tagsList.forEach((tag, idx) => {
    // Drawn with beautiful round tag accents
    doc.setFillColor(255, 255, 255);
    doc.rect(storyX + (idx % 2 === 0 ? 0 : 48), tagY, 42, 9, "F");
    doc.rect(storyX + (idx % 2 === 0 ? 0 : 48), tagY, 42, 9, "S");
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_INK);
    doc.text(tag, storyX + (idx % 2 === 0 ? 3 : 51), tagY + 6);

    if (idx === 1) {
      tagY += 13;
    }
  });

  drawFooter(doc, 2, false);

  // --------------------------------------------------------------------------------
  // PAGE 3: EXPERIENCE (The House Specials Menu Page)
  // --------------------------------------------------------------------------------
  doc.addPage();
  drawPageBackground(doc, false);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("0 3   —   T H E   H O U S E   S P E C I A L S", 15, 25);

  doc.setFont("Times", "italic");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("Locations Curated", 15, 34);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_INK);
  doc.text("A curated selection of environments that shaped the craft.", 15, 41);

  // Displaying venues formatted as an elegant printed menu page
  let itemY = 55;

  VENUES.forEach((venue, index) => {
    // If it's COOX Freelance Specialist, highlight it beautifully
    if (venue.recommended) {
      doc.setFillColor(248, 244, 234); // gold-subtle glow
      doc.rect(12, itemY - 3, PAGE_WIDTH - 24, 39, "F");
      doc.setDrawColor(COLOR_GOLD);
      doc.setLineWidth(0.4);
      doc.rect(12, itemY - 3, PAGE_WIDTH - 24, 39, "S");
    }

    // Left border accent line (GSAP styling draw-in)
    doc.setDrawColor(COLOR_GOLD);
    doc.setLineWidth(venue.recommended ? 0.8 : 0.4);
    doc.line(15, itemY, 15, itemY + 30);

    // Venue Name & Role
    doc.setFont("Times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(venue.recommended ? COLOR_GOLD_DIM : COLOR_INK);
    doc.text(venue.name, 19, itemY + 5);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(COLOR_GOLD);
    doc.text(venue.role.toUpperCase(), 19, itemY + 10);

    // Description (cleanly wrapped text)
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(COLOR_INK);
    const descLines = doc.splitTextToSize(venue.description, PAGE_WIDTH - 110);
    doc.text(descLines, 19, itemY + 16);

    // Competency tags aligned to the right side
    let rightTagY = itemY + 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_GOLD);
    doc.text("CRAFT CONCEPTS:", PAGE_WIDTH - 18, rightTagY, { align: "right" });

    venue.tags.forEach((tag, tIdx) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(COLOR_INK);
      doc.text(`·  ${tag}`, PAGE_WIDTH - 18, rightTagY + 5 + (tIdx * 4.5), { align: "right" });
    });

    // Draw full-width bottom hairline for non-highlighted items, or spacing
    if (!venue.recommended) {
      doc.setDrawColor(COLOR_ASH);
      doc.setLineWidth(0.15);
      doc.line(15, itemY + 34, PAGE_WIDTH - 15, itemY + 34);
    }

    itemY += 41;
  });

  drawFooter(doc, 3, false);

  // --------------------------------------------------------------------------------
  // PAGE 4: PORTFOLIO SIGNATURE SERVES (Divided color backdrop blocks)
  // --------------------------------------------------------------------------------
  doc.addPage();
  drawPageBackground(doc, true);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD);
  doc.text("0 4   —   T H E   S I G N A T U R E   S E R V E S", 15, 23);

  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("The Cocktail Portfolio", 15, 32);

  // Drawing cocktails (2 per page makes it perfectly spaced on page 4)
  let drinkY = 42;

  COCKTAILS.forEach((drink, index) => {
    // Backdrop fill to approximate its temperature
    let rgbFill = [20, 18, 15]; // Velvet Dark
    if (index === 0) rgbFill = [45, 14, 8]; // Deep warm burgundy
    if (index === 1) rgbFill = [13, 26, 46]; // Indigo blue
    if (index === 2) rgbFill = [13, 31, 16]; // Forest green
    if (index === 3) rgbFill = [25, 25, 25]; // Charcoal crystal

    doc.setFillColor(rgbFill[0], rgbFill[1], rgbFill[2]);
    doc.rect(12, drinkY, PAGE_WIDTH - 24, 108, "F");
    
    doc.setDrawColor(COLOR_GOLD_DIM);
    doc.setLineWidth(0.3);
    doc.rect(12, drinkY, PAGE_WIDTH - 24, 108, "S");

    // Drink header
    doc.setFont("Times", "italic");
    doc.setFontSize(20);
    doc.setTextColor(COLOR_GOLD);
    doc.text(drink.name, 19, drinkY + 12);

    // Flavor pills
    let pillX = 19;
    drink.flavorPills.forEach((pill) => {
      doc.setFillColor(10, 9, 6);
      doc.rect(pillX, drinkY + 18, 25, 5, "F");
      doc.setDrawColor(COLOR_GOLD_DIM);
      doc.rect(pillX, drinkY + 18, 25, 5, "S");
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(COLOR_PARCHMENT);
      doc.text(pill, pillX + 12.5, drinkY + 21.6, { align: "center" });
      pillX += 28;
    });

    // Content: Listing and description split vertically
    const divX = 110;

    // LEFT: Tasting notes copy
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(COLOR_PARCHMENT);
    const notesText = doc.splitTextToSize(drink.tastingNote, divX - 25);
    doc.text(notesText, 19, drinkY + 33);

    // Image Reference Box representing the cocktail
    doc.setFillColor(rgbFill[0] + 15, rgbFill[1] + 15, rgbFill[2] + 15);
    doc.rect(19, drinkY + 58, 70, 42, "F");
    doc.setDrawColor(COLOR_GOLD_DIM);
    doc.rect(19, drinkY + 58, 70, 42, "S");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_PARCHMENT);
    doc.text("COCKTAIL COMPOSITION FRAME", 54, drinkY + 76, { align: "center" });
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(COLOR_GOLD);
    doc.text(`[ Ref: ${drink.placeholderPhoto} ]`, 54, drinkY + 82, { align: "center" });

    // RIGHT: Build ingredients & ratios
    doc.setDrawColor(COLOR_GOLD_DIM);
    doc.setLineWidth(0.2);
    doc.line(divX, drinkY + 15, divX, drinkY + 100);

    doc.setFont("Times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(COLOR_GOLD);
    doc.text("Ingredients Build & Layering", divX + 6, drinkY + 20);

    let ingY = drinkY + 30;
    drink.ingredients.forEach((ing) => {
      // Underline style before text
      doc.setDrawColor(COLOR_ASH);
      doc.setLineWidth(0.1);
      doc.line(divX + 6, ingY + 7, divX + 80, ingY + 7);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(COLOR_PARCHMENT);
      doc.text(ing.name, divX + 6, ingY + 4);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(COLOR_GOLD);
      doc.text(ing.role, divX + 80, ingY + 4, { align: "right" });

      ingY += 15;
    });

    drinkY += 114; // spacing between cocktails
  });

  // Footer for page 4
  drawFooter(doc, 4, true);

  // --------------------------------------------------------------------------------
  // PAGE 5: INGREDIENTS (Diageo Certifications & Raw Knowledge Module Verification)
  // --------------------------------------------------------------------------------
  doc.addPage();
  drawPageBackground(doc, false);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("0 5   —   T H E   I N G R E D I E N T S", 15, 25);

  doc.setFont("Times", "italic");
  doc.setFontSize(26);
  doc.setTextColor(COLOR_GOLD);
  doc.text("Hard Power & Capabilities", 15, 34);

  // Left - Diageo Academy Badges + Certifications List
  const contentWidth = PAGE_WIDTH - 30;
  const leftColWidth = contentWidth * 0.45; // ~81mm

  doc.setFillColor(235, 230, 218);
  doc.rect(15, 45, leftColWidth, 192, "F");
  doc.setDrawColor(COLOR_ASH);
  doc.rect(15, 45, leftColWidth, 192, "S");

  // Diageo Academy Title Header inside card
  doc.setFillColor(COLOR_GOLD_DIM);
  doc.rect(15.2, 45.2, leftColWidth - 0.4, 15, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_PARCHMENT);
  doc.text("DIAGEO BAR ACADEMY", 15 + leftColWidth / 2, 54, { align: "center" });

  // List of certificate pills
  let certY = 70;
  CERTIFICATIONS.forEach((cert) => {
    // highlighted block
    if (cert.highlighted) {
      doc.setFillColor(242, 226, 184); // gold highlighted rect
      doc.rect(18, certY - 3, leftColWidth - 6, 6, "F");
      doc.setDrawColor(COLOR_GOLD);
      doc.rect(18, certY - 3, leftColWidth - 6, 6, "S");
      
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(COLOR_GOLD_DIM);
    } else {
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(COLOR_INK);
    }

    doc.setFontSize(7.5);
    doc.text(`[x] ${cert.name}`, 21, certY + 1.2);

    certY += 7.5;
  });

  // Oversized credential banner at the bottom left
  doc.setFont("Times", "bold");
  doc.setFontSize(40);
  doc.setTextColor(COLOR_GOLD);
  doc.text("15 Module", 15 + leftColWidth / 2, 198, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("COMPLETED CREDENTIALS RECORD", 15 + leftColWidth / 2, 206, { align: "center" });
  
  // Right - Skill Progress Bars
  const rightX = 15 + leftColWidth + 10;
  const rightColWidth = PAGE_WIDTH - rightX - 15;

  doc.setFont("Times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_GOLD);
  doc.text("Mixologist Competency Vector", rightX, 52);
  doc.line(rightX, 56, PAGE_WIDTH - 15, 56);

  let skillY = 66;
  SKILLS.forEach((skill) => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLOR_INK);
    doc.text(skill.name, rightX, skillY);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_GOLD_DIM);
    doc.text(`${skill.percentage}%`, PAGE_WIDTH - 15, skillY, { align: "right" });

    // Progress tracks
    doc.setDrawColor(COLOR_ASH);
    doc.setLineWidth(1.6);
    doc.line(rightX, skillY + 4, PAGE_WIDTH - 15, skillY + 4);

    doc.setDrawColor(COLOR_GOLD);
    doc.setLineWidth(1.6);
    doc.line(rightX, skillY + 4, rightX + (rightColWidth * skill.percentage) / 100, skillY + 4);

    skillY += 15;
  });

  // CERTIFICATION RECORD - dashed box placeholders for verified assets
  const certBoxY = 175;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("VERIFIED CERTIFICATION RECORD", rightX, certBoxY - 5);

  // 3 dashed boxes mimicking verification layout
  let boxX = rightX;
  const boxW = 20;
  const boxH = 14;

  for (let bIdx = 0; bIdx < 3; bIdx++) {
    doc.setDrawColor(COLOR_GOLD_DIM);
    doc.setLineWidth(0.2);
    // Draw simple dashes manually for PDF compatibility
    doc.rect(boxX, certBoxY, boxW, boxH);
    doc.line(boxX, certBoxY, boxX + boxW, certBoxY + boxH); // Crossed to indicate security placeholder
    doc.line(boxX + boxW, certBoxY, boxX, certBoxY + boxH);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(COLOR_GOLD_DIM);
    doc.text("VERIFIED", boxX + boxW / 2, certBoxY + 5, { align: "center" });
    doc.text(`ID: DB04-0${bIdx + 1}`, boxX + boxW / 2, certBoxY + 10, { align: "center" });

    boxX += 24;
  }

  // Legend footnote
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_GOLD_DIM);
  doc.text("Original certification and exam transcript records verified via", rightX, certBoxY + 22);
  doc.text("Diageo Bar Academy trade profile ID: #HN-9610. Verified on request.", rightX, certBoxY + 25.5);

  drawFooter(doc, 5, false);

  // --------------------------------------------------------------------------------
  // PAGES 6 - 10: VERIFIED CERTIFICATES OF COMPLETION
  // --------------------------------------------------------------------------------
  DIAGEO_CERTIFICATES.forEach((cert) => {
    doc.addPage();
    
    // Draw burgundy borders
    doc.setFillColor(139, 10, 26); // Deep Burgundy (#8B0A1A)
    doc.rect(0, 0, PAGE_WIDTH, 5, "F");
    doc.rect(0, PAGE_HEIGHT - 5, PAGE_WIDTH, 5, "F");

    // Logo Header
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#4a4135"); // Charcoal dark
    doc.text("............................ DIAGEO ............................ ", PAGE_WIDTH / 2, 34, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(26);
    doc.text("BAR ACADEMY", PAGE_WIDTH / 2, 47, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("........................................................................", PAGE_WIDTH / 2, 53, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("R A I S E   T H E   B A R", PAGE_WIDTH / 2, 60, { align: "center" });

    // Certificate of Completion Main Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor("#111111");
    doc.text("CERTIFICATE", PAGE_WIDTH / 2, 88, { align: "center" });
    doc.text("OF COMPLETION", PAGE_WIDTH / 2, 104, { align: "center" });

    // Acknowledgement and Recipient
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor("#444444");
    doc.text("THIS IS TO ACKNOWLEDGE", PAGE_WIDTH / 2, 126, { align: "center" });

    doc.setFont("Times", "italic");
    doc.setFontSize(20);
    doc.setTextColor("#1a150e");
    doc.text("Hemakshe Nagaraj", PAGE_WIDTH / 2, 144, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor("#444444");
    
    if (cert.isOnlineCourse) {
      doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });
      doc.text("THE ONLINE COURSE", PAGE_WIDTH / 2, 171, { align: "center" });

      // Certificate Course Title (Elegant serif italic)
      doc.setFont("Times", "italic");
      doc.setFontSize(22);
      doc.setTextColor(COLOR_GOLD); // Gold color for focus
      doc.text(cert.title, PAGE_WIDTH / 2, 194, { align: "center" });
      
      // Line art glasses drawing mimicking original icon on page 3
      const iconY = PAGE_HEIGHT - 43;
      doc.setDrawColor("#4a4135");
      doc.setLineWidth(0.35);
      
      // Draw shaker (slanted lines)
      doc.line(78, iconY, 81, iconY + 12);
      doc.line(86, iconY, 83, iconY + 12);
      doc.line(78, iconY, 86, iconY);
      doc.line(81, iconY + 12, 83, iconY + 12);
      
      // Draw cocktail coupe
      doc.line(94, iconY, 104, iconY); // rim
      doc.line(94, iconY, 99, iconY + 6); // left bowl
      doc.line(104, iconY, 99, iconY + 6); // right bowl
      doc.line(99, iconY + 6, 99, iconY + 12); // stem
      doc.line(96, iconY + 12, 102, iconY + 12); // base

      // Draw circular smile face shaker symbol
      doc.circle(113, iconY + 6, 4);
      doc.line(111.5, iconY + 5, 112.5, iconY + 5); // left eye
      doc.line(113.5, iconY + 5, 114.5, iconY + 5); // right eye
      doc.line(111.5, iconY + 7.5, 114.5, iconY + 7.5); // smile line

      // Draw dual bottles outline
      doc.line(125, iconY, 125, iconY + 12);
      doc.line(129, iconY, 129, iconY + 12);
      doc.line(125, iconY, 129, iconY);
      doc.line(125, iconY + 12, 129, iconY + 12);
    } else {
      doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });

      // Certificate Course Title (Clean font for standard curriculum)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(cert.title, PAGE_WIDTH - 45);
      let currY = 186;
      titleLines.forEach((line: string) => {
        doc.text(line, PAGE_WIDTH / 2, currY, { align: "center" });
        currY += 9;
      });
    }

    // Seal and Date Footers
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#4a4135");
    doc.text("Sealed under the authority of Diageo trustees", 15, PAGE_HEIGHT - 22);
    doc.text(cert.date, 15, PAGE_HEIGHT - 17);
  });

  // Save the publication
  doc.save("The_Liquid_Menu_Hemakshe_Nagaraj.pdf");
}

export function generateCertificatesOnlyPDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  DIAGEO_CERTIFICATES.forEach((cert, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    // Draw burgundy borders
    doc.setFillColor(139, 10, 26); // Deep Burgundy (#8B0A1A)
    doc.rect(0, 0, PAGE_WIDTH, 5, "F");
    doc.rect(0, PAGE_HEIGHT - 5, PAGE_WIDTH, 5, "F");

    // Logo Header
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#4a4135"); // Charcoal dark
    doc.text("............................ DIAGEO ............................ ", PAGE_WIDTH / 2, 34, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(26);
    doc.text("BAR ACADEMY", PAGE_WIDTH / 2, 47, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("........................................................................", PAGE_WIDTH / 2, 53, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("R A I S E   T H E   B A R", PAGE_WIDTH / 2, 60, { align: "center" });

    // Certificate of Completion Main Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor("#111111");
    doc.text("CERTIFICATE", PAGE_WIDTH / 2, 88, { align: "center" });
    doc.text("OF COMPLETION", PAGE_WIDTH / 2, 104, { align: "center" });

    // Acknowledgement and Recipient
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor("#444444");
    doc.text("THIS IS TO ACKNOWLEDGE", PAGE_WIDTH / 2, 126, { align: "center" });

    doc.setFont("Times", "italic");
    doc.setFontSize(20);
    doc.setTextColor("#1a150e");
    doc.text("Hemakshe Nagaraj", PAGE_WIDTH / 2, 144, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor("#444444");
    
    if (cert.isOnlineCourse) {
      doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });
      doc.text("THE ONLINE COURSE", PAGE_WIDTH / 2, 171, { align: "center" });

      // Certificate Course Title (Elegant serif italic)
      doc.setFont("Times", "italic");
      doc.setFontSize(22);
      doc.setTextColor(COLOR_GOLD); // Gold color for focus
      doc.text(cert.title, PAGE_WIDTH / 2, 194, { align: "center" });
      
      // Line art glasses drawing mimicking original icon on page 3
      const iconY = PAGE_HEIGHT - 43;
      doc.setDrawColor("#4a4135");
      doc.setLineWidth(0.35);
      
      // Draw shaker (slanted lines)
      doc.line(78, iconY, 81, iconY + 12);
      doc.line(86, iconY, 83, iconY + 12);
      doc.line(78, iconY, 86, iconY);
      doc.line(81, iconY + 12, 83, iconY + 12);
      
      // Draw cocktail coupe
      doc.line(94, iconY, 104, iconY); // rim
      doc.line(94, iconY, 99, iconY + 6); // left bowl
      doc.line(104, iconY, 99, iconY + 6); // right bowl
      doc.line(99, iconY + 6, 99, iconY + 12); // stem
      doc.line(96, iconY + 12, 102, iconY + 12); // base

      // Draw circular smile face shaker symbol
      doc.circle(113, iconY + 6, 4);
      doc.line(111.5, iconY + 5, 112.5, iconY + 5); // left eye
      doc.line(113.5, iconY + 5, 114.5, iconY + 5); // right eye
      doc.line(111.5, iconY + 7.5, 114.5, iconY + 7.5); // smile line

      // Draw dual bottles outline
      doc.line(125, iconY, 125, iconY + 12);
      doc.line(129, iconY, 129, iconY + 12);
      doc.line(125, iconY, 129, iconY);
      doc.line(125, iconY + 12, 129, iconY + 12);
    } else {
      doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });

      // Certificate Course Title (Clean font for standard curriculum)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(cert.title, PAGE_WIDTH - 45);
      let currY = 186;
      titleLines.forEach((line: string) => {
        doc.text(line, PAGE_WIDTH / 2, currY, { align: "center" });
        currY += 9;
      });
    }

    // Seal and Date Footers
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#4a4135");
    doc.text("Sealed under the authority of Diageo trustees", 15, PAGE_HEIGHT - 22);
    doc.text(cert.date, 15, PAGE_HEIGHT - 17);
  });

  // Save only certificates
  doc.save("Diageo_Bar_Academy_Certificates_Hemakshe_Nagaraj.pdf");
}
