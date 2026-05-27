import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";
import nodemailer from "nodemailer";

dotenv.config();

// Lazy load Gemini Client to handle missing key gracefully
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Settings > Secrets panel flow to enable AI product image generation.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Lazy load Stripe client
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required to execute real payments.");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload sizes to handle possible high fidelity image transfers if custom assets used
  app.use(express.json({ limit: "20mb" }));

  // API Route for secure image generation via Gemini 
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, style, category } = req.body;
      
      const promptText = (prompt || "").trim();
      if (!promptText) {
        return res.status(400).json({ error: "Un prompt, un nom ou une description de produit est nécessaire." });
      }

      const client = getGeminiClient();

      // Style prompt builder tailored to Merakya's sacred natural Moroccan brand identity
      let finalPrompt = "";
      if (style === "STUDIO_PREMIUM") {
        finalPrompt = `Pristine commercial product photography of a premium cosmetic item or ritual accessory based on the description: "${promptText}". Elegant glass containers or organic material, placed on a smooth, beautiful neutral beige terracotta background, styled with soft shadows, minimalist chic, luxury branding, high fidelity, 8k, photorealistic.`;
      } else if (style === "COSMIC") {
        finalPrompt = `An evocative and mystical alchemical product image of a ritual creation: "${promptText}". Beautiful composition showing glowing ritual beeswax or golden wax candle, surrounded by raw celestial quartz crystals, shiny amethyst shards, and intricate stargazing brass instruments in back. Ambient candle glow, deep mysterious charcoal background shadows, highly cinematic, magical atmosphere.`;
      } else if (style === "OASIS") {
        finalPrompt = `Organic product setup based on "${promptText}". Located in warm Moroccan sunlit desert clay stones with actual soft golden dunes background. Features high-quality cosmetics or hand-poured soap, accompanied by dry Sahara botanical leaves, twigs of fresh mint, earthy textures, dramatic direct sunlight shadows, breathtaking.`;
      } else if (style === "MINIMALIST_ZEN") {
        finalPrompt = `Wabi-sabi minimalist aesthetic raw photography of a natural brand product: "${promptText}". Displayed on pristine rough volcanic slate or light grey stone block, side light, soft leaves shadows, neutral warm gray background, calm, balanced, 8k, photorealistic.`;
      } else if (style === "VINTAGE_HERBALIST") {
        finalPrompt = `Rustic botanical apothecary vintage photography of a sacred creation: "${promptText}". Placed on a dark rustic textured oak wood table, surrounded by antique copper mortar, stacks of old mystical leather-bound books, hanging dried wildflower bundles, warm flickering candle lighting, moody fine art feel.`;
      } else if (style === "ROYAL_HAMMAM") {
        finalPrompt = `Fabulous premium Moroccan Hammam royal interior setup of: "${promptText}". Standing on a glowing wet white Carrara marble plinth, gold geometric brass bowls, warm steam vapor clouds, exotic door arc shadows, amber copper lanterns, high luxury elegant lifestyle.`;
      } else if (style === "SACRED_LUNAR") {
        finalPrompt = `Ethereal nocturnal celestial product photoshoot of: "${promptText}". Under a deep cosmic indigo night sky background lit by a glowing crescent silver moon beam, standing on a round metallic astrological plate, soft stardust mist, magic dream atmosphere.`;
      } else if (style === "ATLAS_SUNSET") {
        finalPrompt = `Deep evocative sunlit landscape photography of: "${promptText}". Placed on red earthen terracotta clay soil of the Atlas valleys, glowing direct hot golden hour sunset flares, long cinematic clay shadows, wild desert herbs, rich dry natural colors.`;
      } else {
        // Fallback elegant style
        finalPrompt = `Elegant studio shot of "${promptText}", luxurious feel, fine placement, soft premium lighting, highly detailed.`;
      }

      // Include contextual keywords relative to categories like soap or candle for better coherence
      if (category) {
        const catLower = category.toLowerCase();
        if (catLower.includes("savon") || catLower.includes("soap")) {
          finalPrompt += " It is a beautifully crafted, artisanal cold-processed soap bar showing layers of natural clay.";
        } else if (catLower.includes("bougie") || catLower.includes("candle")) {
          finalPrompt += " It is a luxury hand-poured candle in an amber glass jar or ceramics container.";
        } else if (catLower.includes("sel") || catLower.includes("bain")) {
          finalPrompt += " It is natural bath salts and minerals styled elegantly.";
        } else if (catLower.includes("huile") || catLower.includes("elixir") || catLower.includes("élixir")) {
          finalPrompt += " It is an apothecary amber glass bottle with dropper, showcasing pure organic oil.";
        }
      }

      console.log("Generating image with prompt via Gemini 2.5:", finalPrompt);

      // Call the gemini-2.5-flash-image model as instructed
      const apiResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let foundImageBase64: string | null = null;
      let textLogs = "";

      if (apiResponse.candidates && apiResponse.candidates[0]?.content?.parts) {
        for (const part of apiResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            foundImageBase64 = part.inlineData.data;
          } else if (part.text) {
            textLogs += part.text;
          }
        }
      }

      if (foundImageBase64) {
        const imageUrl = `data:image/png;base64,${foundImageBase64}`;
        return res.json({ imageUrl });
      } else {
        console.warn("No base64 data returned by model:", textLogs);
        throw new Error("No image data returned from Gemini");
      }
    } catch (error: any) {
      console.warn("Skipping standard Gemini generation and launching aesthetic alchemical fallback due to API or Quota limit:", error.message || error);
      
      const textQuery = (req.body.prompt || "").toLowerCase() + " " + (req.body.category || "").toLowerCase();
      let matchedUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"; // Lit amber candle
      
      if (textQuery.includes("sauge") || textQuery.includes("sauve") || textQuery.includes("clean") || textQuery.includes("herbe") || textQuery.includes("blanc") || textQuery.includes("pure") || textQuery.includes("sable")) {
        matchedUrl = "https://images.unsplash.com/photo-1602872030219-cbf948a91478?auto=format&fit=crop&q=80&w=800"; // Sage candle jar
      } else if (textQuery.includes("rose") || textQuery.includes("fleur") || textQuery.includes("damas") || textQuery.includes("parfum") || textQuery.includes("love") || textQuery.includes("amour")) {
        matchedUrl = "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=800"; // Rose bouquet soap
      } else if (textQuery.includes("bain") || textQuery.includes("sel") || textQuery.includes("cristal") || textQuery.includes("marine") || textQuery.includes("mer") || textQuery.includes("sel de bain")) {
        matchedUrl = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"; // Natural mineral salts
      } else if (textQuery.includes("huile") || textQuery.includes("elixir") || textQuery.includes("extrait") || textQuery.includes("botanique") || textQuery.includes("visage") || textQuery.includes("serum") || textQuery.includes("sérum") || textQuery.includes("cheveux") || textQuery.includes("peau")) {
        matchedUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800"; // Pipette skin oil
      } else if (textQuery.includes("savon") || textQuery.includes("soin") || textQuery.includes("argile") || textQuery.includes("lavande") || textQuery.includes("fleurie")) {
        matchedUrl = "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=800"; // Lavender natural bar
      } else if (textQuery.includes("hannan") || textQuery.includes("hammam") || textQuery.includes("noir") || textQuery.includes("eucalyptus") || textQuery.includes("gommage")) {
        matchedUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"; // Eucalyptus leaf / design
      } else if (textQuery.includes("orange") || textQuery.includes("fleur d'oranger") || textQuery.includes("agrume") || textQuery.includes("citron") || textQuery.includes("oranger")) {
        matchedUrl = "https://images.unsplash.com/photo-1611081496685-afe4a34b2230?auto=format&fit=crop&q=80&w=800"; // Orange visual
      } else if (textQuery.includes("encens") || textQuery.includes("oud") || textQuery.includes("fumée") || textQuery.includes("resine")) {
        matchedUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800"; // Burning incenses
      } else if (textQuery.includes("jasmin") || textQuery.includes("fleur blanche")) {
        matchedUrl = "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=800"; // Jasmine cosmetics style
      } else if (textQuery.includes("bleu") || textQuery.includes("oeil") || textQuery.includes("nuit") || textQuery.includes("celeste")) {
        matchedUrl = "https://images.unsplash.com/photo-1572726710708-2079fa5730ea?auto=format&fit=crop&q=80&w=800"; // Mystical blue
      } else if (textQuery.includes("savon") || textQuery.includes("soap") || textQuery.includes("naturels")) {
        matchedUrl = "https://images.unsplash.com/photo-1607006342411-9c315e717552?auto=format&fit=crop&q=80&w=800";
      } else if (textQuery.includes("sel") || textQuery.includes("bain") || textQuery.includes("énergétiques")) {
        matchedUrl = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800";
      } else if (textQuery.includes("huile") || textQuery.includes("élixir") || textQuery.includes("elixir") || textQuery.includes("botaniques")) {
        matchedUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800";
      } else if (textQuery.includes("coffret") || textQuery.includes("rituels")) {
        matchedUrl = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800";
      }
      
      // Return 200 with the fallback image URL and a clear isFallback indicator
      return res.json({ 
        imageUrl: matchedUrl, 
        isFallback: true,
        reason: error.message || "Quota de l'API Gemini dépassé pour les images. Évocation de secours activée."
      });
    }
  });

  // Transactional Email Confirmation system powered by joys.kenza@gmail.com
  async function sendOrderConfirmationEmail(order: any, language: string) {
    const smtpUser = process.env.SMTP_USER || "joys.kenza@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "fjqh-kiti-llgu-kvxo-jbyy";

    if (!smtpUser || !smtpPass) {
      console.warn("[SMTP] Configuration is incomplete. Skipping email dispatch.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isEn = language === "EN";
    const currencyStr = order.currency || "MAD";
    const currencySymbol = currencyStr === "EUR" ? "€" : currencyStr === "USD" ? "$" : " MAD";

    // Build item rows
    const itemsHtml = order.cart.map((item: any) => `
      <tr style="border-bottom: 1px solid #E8DCC6;">
        <td style="padding: 12px 6px; font-family: 'Georgia', serif; font-size: 13.5px; text-align: left; color: #1E1A16;">
          <strong>${item.product.name}</strong><br/>
          <span style="font-size: 10px; color: #A67C52; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">${item.product.category}</span>
        </td>
        <td style="padding: 12px 6px; font-family: monospace; font-size: 13px; text-align: center; color: #6B4E2E;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 6px; font-family: monospace; font-size: 13px; text-align: right; color: #1E1A16; font-weight: bold;">
          ${item.product.price} ${currencySymbol}
        </td>
      </tr>
    `).join("");

    const customerSubject = isEn 
      ? `✦ Merakya Ritual Order Confirmation - ${order.id}` 
      : `✦ Confirmation de votre Rituel Merakya - ${order.id}`;

    const customerHtml = `
      <div style="background-color: #F7F2EB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1E1A16; padding: 40px 15px; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #E8DCC6;">
        <!-- Logo Header -->
        <div style="margin-bottom: 30px; text-align: center;">
          <h1 style="font-family: 'Georgia', serif; font-size: 28px; font-weight: normal; color: #1E1A16; letter-spacing: 5px; margin: 0; text-transform: uppercase;">MERAKYA</h1>
          <p style="font-size: 9px; letter-spacing: 3px; color: #A67C52; margin: 5px 0 0 0; text-transform: uppercase;">Rituels Alchimiques du Maroc</p>
        </div>

        <div style="background-color: #FFFFFF; padding: 35px 25px; border-radius: 2px; border: 1px solid #E8DCC6; text-align: left;">
          <h2 style="font-family: 'Georgia', serif; font-size: 18px; color: #A67C52; border-bottom: 1px solid #E8DCC6; padding-bottom: 15px; margin-top: 0; font-weight: normal; letter-spacing: 1.2px;">
            ${isEn ? "Grace & Luminosity," : "Grâce & Luminosité,"}
          </h2>
          
          <p style="font-size: 14.5px; line-height: 1.65; color: #4A453F; font-family: 'Georgia', serif; font-style: italic; margin-bottom: 25px;">
            ${isEn 
              ? `Dear ${order.customerName || "Initiate"}, your order has been received at our Marrakech laboratory. Our master artisans are preparing your alchemical compositions and custom rituals with utmost devotion and intention.`
              : `Chère ${order.customerName || "Initié(e)"}, votre commande d'exception a été reçue avec gratitude. Nos maîtres artisans à l'atelier de Marrakech façonnent déjà et purifient vos soins et rituels sacrés infusés d'énergies bénéfiques.`}
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
              <tr style="border-bottom: 2px solid #A67C52;">
                <th style="padding: 8px 6px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #A67C52; text-align: left;">${isEn ? "Creation" : "Création"}</th>
                <th style="padding: 8px 6px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #A67C52; text-align: center;">${isEn ? "Qty" : "Qté"}</th>
                <th style="padding: 8px 6px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #A67C52; text-align: right;">${isEn ? "Price" : "Prix"}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 15px 6px 6px 6px; font-size: 11px; color: #6B4E2E; font-weight: bold; text-align: right; text-transform: uppercase; letter-spacing: 1px;">TOTAL</td>
                <td style="padding: 15px 6px 6px 6px; font-size: 16px; font-weight: bold; color: #1E1A16; text-align: right; font-family: monospace;">
                  ${order.totalAmount} ${currencySymbol}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Shipping Coordinates -->
          <div style="background-color: #F7F2EB; border-left: 3px solid #A67C52; padding: 18px; margin: 25px 0;">
            <h4 style="margin: 0 0 8px 0; font-size: 10.5px; text-transform: uppercase; letter-spacing: 1.5px; color: #A67C52;">${isEn ? "SHIPPING COORDINATES" : "COORDONNÉES DE LIVRAISON"}</h4>
            <p style="margin: 0; font-size: 13px; font-family: monospace; color: #101010; line-height: 1.5;">
              <strong>${order.customerName}</strong><br/>
              ${order.customerAddress}<br/>
              ${isEn ? "Mobile: " : "Téléphone: "}${order.customerPhone}
            </p>
          </div>

          <!-- Celestial Lunar Note -->
          <div style="border-top: 1px solid #E8DCC6; padding-top: 20px; text-align: center; margin-top: 25px;">
            <span style="font-size: 13px;">🌒 ✦ 🌘</span>
            <p style="font-size: 12px; font-family: 'Georgia', serif; font-style: italic; color: #A67C52; margin: 5px 0 0 0; line-height: 1.5;">
              ${isEn 
                ? "May this customized ritual bless your sanctuary and bring peace, elevation and sensory alignment."
                : "Puisse ce rituel sur-mesure bénir votre sanctuaire de lumière, d'élévation et d'alignement sensoriel."}
            </p>
          </div>
        </div>

        <div style="font-size: 10px; color: #A67C52; margin-top: 30px; letter-spacing: 1.5px; line-height: 1.6;">
          Laboratoires Merakya • Guéliz, Marrakech, Maroc • contact@merakyalab.com<br/>
          © 2026 MERAKYA INC. Tous droits réservés.
        </div>
      </div>
    `;

    const adminSubject = `🚨 NOUVELLE COMMANDE MERAKYA [${order.id}] - ${order.customerName}`;
    const adminHtml = `
      <div style="background-color: #1E1A16; font-family: 'Courier New', Courier, monospace; color: #F7F2EB; padding: 35px 25px; border: 2px solid #A67C52; max-width: 600px; margin: 0 auto; text-align: left;">
        <h2 style="color: #A67C52; font-size: 18px; border-bottom: 2px solid #A67C52; padding-bottom: 12px; text-transform: uppercase; margin-top: 0; letter-spacing: 2px;">
          ✦ COMMANDE REÇUE (KENZA CORE) ✦
        </h2>
        
        <p style="font-size: 13px; line-height: 1.5; color: #F7F2EB;">
          Bonjour Kenza, une nouvelle commande d'exception vient d'être validée sur l'application Merakya. Voici les détails pour la préparation du colis :
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; color: #F7F2EB;">
          <thead>
            <tr style="border-bottom: 1px solid #A67C52; text-align: left;">
              <th style="padding: 8px 4px; color: #A67C52;">Article</th>
              <th style="padding: 8px 4px; color: #A67C52; text-align: center;">Qté</th>
              <th style="padding: 8px 4px; color: #A67C52; text-align: right;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${order.cart.map((item: any) => `
              <tr style="border-bottom: 1px dashed rgba(166,124,82,0.3);">
                <td style="padding: 10px 4px;"><strong>${item.product.name}</strong> (${item.product.category})</td>
                <td style="padding: 10px 4px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 4px; text-align: right; font-weight: bold;">${item.product.price} ${currencySymbol}</td>
              </tr>
            `).join("")}
            <tr>
              <td colspan="2" style="font-weight: bold; padding: 15px 4px; text-align: right; color: #A67C52;">MONTANT TOTAL :</td>
              <td style="font-weight: bold; padding: 15px 4px; text-align: right; color: #A67C52; font-size: 15px;">${order.totalAmount} ${currencySymbol}</td>
            </tr>
          </tbody>
        </table>

        <!-- Client profile and delivery detailed specs -->
        <div style="background-color: rgba(255,255,255,0.04); padding: 18px; border-left: 3px solid #A67C52; margin-top: 20px; border-radius: 2px;">
          <h4 style="color: #A67C52; margin: 0 0 8px 0; font-size: 12px; letter-spacing: 1px;">INFORMATIONS DE LIVRAISON CLIENT</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5;">
            <strong>Nom complet :</strong> ${order.customerName}<br/>
            <strong>Courriel :</strong> ${order.customerEmail}<br/>
            <strong>Téléphone :</strong> ${order.customerPhone}<br/>
            <strong>Adresse :</strong> ${order.customerAddress}<br/>
            <strong>Méthode de paiement :</strong> ${order.paymentMethod === "card" ? "Carte Bancaire (Stripe Payée)" : "Paiement à la livraison / Cash on Delivery (COD)"}
          </p>
        </div>

        <p style="font-size: 11px; text-align: center; color: #888; border-top: 1px solid rgba(166,124,82,0.2); padding-top: 18px; margin-top: 25px; margin-bottom: 0;">
          Merakya Enterprise Automation Core • Admin : joys.kenza@gmail.com
        </p>
      </div>
    `;

    try {
      // 1. Dispatch customer receipt email
      await transporter.sendMail({
        from: `"Confrérie Merakya ✦" <${smtpUser}>`,
        to: order.customerEmail,
        subject: customerSubject,
        html: customerHtml,
      });

      // 2. Dispatch admin notification update
      await transporter.sendMail({
        from: `"Merakya Boutique Core" <${smtpUser}>`,
        to: "joys.kenza@gmail.com",
        subject: adminSubject,
        html: adminHtml,
      });

      console.log(`[SMTP] Success! Confirmation emails dispatched to customer (${order.customerEmail}) and admin (${smtpUser})`);
      return true;
    } catch (err) {
      console.error("[SMTP] Core notification dispatch failed:", err);
      return false;
    }
  }

  // API endpoint to orchestrate order receipt dispatches safely
  app.post("/api/send-order-confirmation", async (req, res) => {
    try {
      const { 
        orderId, 
        customerName, 
        customerEmail, 
        customerPhone, 
        customerAddress, 
        cart, 
        totalAmount, 
        currency, 
        paymentMethod,
        language 
      } = req.body;

      if (!customerEmail || !cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Required fields missing for dispatching mail confirmations." });
      }

      const orderData = {
        id: orderId || `MK-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        cart,
        totalAmount,
        currency,
        paymentMethod
      };

      const dispatchResult = await sendOrderConfirmationEmail(orderData, language || "FR");
      return res.json({ success: dispatchResult });
    } catch (error: any) {
      console.error("[Email API] Dispatch sequence failure:", error);
      return res.status(500).json({ error: error.message || "Email dispatch failed internally on server." });
    }
  });


  // Check if Stripe configuration is loaded to dynamically handle the checkout flow layout
  app.get("/api/stripe-config", (req, res) => {
    res.json({
      publicKey: process.env.VITE_STRIPE_PUBLIC_KEY || "pk_live_51TZC1LFsO1Kahb8dfi5Sz64wLwqAygRC7LNel2pfqh1yRM8l4GFYnyzUQqLaezw3GWrLMxYKH5eipwS71dCvrNzc00GzI2kTZx",
      hasStripeSetup: !!process.env.STRIPE_SECRET_KEY
    });
  });

  // API route for launching a secure Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { cart, customerEmail, customerName, customerPhone, customerAddress, currency } = req.body;

      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Votre panier d'achats est vide ou invalide." });
      }

      const hasKey = !!process.env.STRIPE_SECRET_KEY;
      if (!hasKey) {
        return res.status(400).json({
          error: "STRIPE_SECRET_KEY_MISSING",
          message: "Clé STRIPE_SECRET_KEY manquante. Veuillez la configurer dans l'onglet Settings > Secrets pour l'activer en production."
        });
      }

      const stripe = getStripeClient();

      // Transform cart items to Stripe compliant Checkout Session parameters
      const line_items = cart.map((item: any) => {
        // Stripe expects unit_amount in minor fractional units (cents)
        // Correctly handle decimal alignment (e.g., 150 MAD -> 15000)
        const unitAmount = Math.round(item.product.price * 100);
        return {
          price_data: {
            currency: (currency || "MAD").toLowerCase(),
            product_data: {
              name: item.product.name,
              images: item.product.image ? [item.product.image] : [],
              description: `Rituel sacré - ${item.product.category}`,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

      // Get requester referrer to build redirect links
      const referer = req.headers.referer || req.headers.origin || "https://ais-dev-fqexdwvvg6js7xov6qvifl-681898090137.europe-west2.run.app";
      const baseUrl = referer.split("?")[0];

      console.log(`Initiating Stripe checkout session for ${line_items.length} items. Total Currency: ${currency || "MAD"}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        customer_email: customerEmail || undefined,
        metadata: {
          customerName: customerName || "",
          customerPhone: customerPhone || "",
          customerAddress: customerAddress || "",
        },
        success_url: `${baseUrl}?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}?stripe_status=cancel`,
      });

      return res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe session creation error:", error);
      return res.status(500).json({
        error: error.message || "Une erreur s'est produite lors de la génération de la passerelle de paiement."
      });
    }
  });

  // API route for generating a Stripe Payment Intent (for customized inline checkout experience)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency, email, customerName, metadata } = req.body;

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Le montant du paiement est invalide." });
      }

      const hasKey = !!process.env.STRIPE_SECRET_KEY;
      if (!hasKey) {
        return res.status(400).json({
          error: "STRIPE_SECRET_KEY_MISSING",
          message: "Clé STRIPE_SECRET_KEY manquante. Veuillez la configurer dans l'onglet Settings > Secrets pour l'activer en production."
        });
      }

      const stripe = getStripeClient();

      // Stripe unit amount expects integers in cents/smallest fractional currency unit
      const unitAmount = Math.round(parseFloat(amount) * 100);

      console.log(`Generating Stripe Payment Intent for ${unitAmount} ${currency || "MAD"} for customer ${customerName || email}`);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: unitAmount,
        currency: (currency || "MAD").toLowerCase(),
        receipt_email: email || undefined,
        metadata: {
          customerName: customerName || "",
          currencyChoice: currency || "MAD",
          ...(metadata || {})
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe Payment Intent generation error:", error);
      return res.status(500).json({
        error: error.message || "Une erreur s'est produite lors de la génération de l'intention de paiement."
      });
    }
  });


  // Vite middleware setup to mount SPA compilation and HMR controls
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server with integrated Vite middleware started on host 0.0.0.0, port ${PORT}`);
  });
}

startServer();
