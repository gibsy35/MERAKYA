import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";

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
        return res.status(500).json({ 
          error: "Le modèle d'IA n'a pas pu dessiner de visuel pour ce prompt.", 
          details: textLogs 
        });
      }
    } catch (error: any) {
      console.error("Gemini Image generation error:", error);
      return res.status(500).json({ 
        error: error.message || "Une erreur s'est produite lors de la connexion au modèle d'image de l'IA." 
      });
    }
  });

  // Check if Stripe configuration is loaded to dynamically handle the checkout flow layout
  app.get("/api/stripe-config", (req, res) => {
    res.json({
      publicKey: process.env.VITE_STRIPE_PUBLIC_KEY || null,
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
