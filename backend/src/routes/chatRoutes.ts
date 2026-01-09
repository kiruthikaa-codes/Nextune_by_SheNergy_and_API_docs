import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple in-memory session store for prototype
interface ChatSessionState {
  id: string;
  customer_id?: string;
  vin?: string;
  /**
   * Simple flag so we only do the long self-introduction once per session.
   */
  hasIntroduced?: boolean;
  /**
   * How many short clarification turns we've already done for the current issue.
   * Used to avoid asking too many questions before moving on.
   */
  clarificationCount?: number;
  /**
   * Whether we have already surfaced critical predictive recommendations in this
   * session/issue, to avoid looping the same suggestions over and over.
   */
  hasShownPredictiveCritical?: boolean;
  pendingInventoryCheck?: {
    dealership_id: string;
    inventory_needed: string[];
    rankingPayload: any;
    missingPartsNote?: string;
  };
}

const sessions = new Map<string, ChatSessionState>();
const router = Router();

// Helper to call our own backend endpoints
const BACKEND_BASE = process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000/api';

// Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
// Use the current Gemini chat model ID as per AI Studio
const chatModelId = 'gemini-2.5-flash';

async function generateReply(systemContext: string, userMessage: string): Promise<string> {
  if (!genAI) {
    // Fallback if API key is not configured
    return systemContext;
  }
  const model = genAI.getGenerativeModel({ model: chatModelId });
  const prompt = `${systemContext}\n\nUser: ${userMessage}\nAssistant (SheNergy, Bangalore):`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text || systemContext;
}

// Lightweight intent classifier powered by Gemini so we don't rely only on manual keyword lists.
// Returns a structured object that indicates what the user is trying to do.
async function classifyIntent(userMessage: string): Promise<{
  issue_intent: string;
  booking_intent: boolean;
  clarity: 'clear' | 'unclear';
  service_codes_guess: string[];
}> {
  if (!genAI) {
    // Fallback if Gemini not configured
    return {
      issue_intent: 'unknown',
      booking_intent: false,
      clarity: 'unclear',
      service_codes_guess: []
    };
  }

  const model = genAI.getGenerativeModel({ model: chatModelId });
  const systemContext = `You are an intent classifier for an automotive service assistant in Bangalore.
You will be given a single user message about their car.
You MUST respond with STRICT JSON only, no extra text, in the following TypeScript-like shape:
{
  "issue_intent": string,              // e.g. "brakes", "ac", "engine", "periodic_service", "other"
  "booking_intent": boolean,          // true if the user seems to want to book or schedule service
  "clarity": "clear" | "unclear",   // "clear" if the issue description is specific enough to map to services
  "service_codes_guess": string[]     // zero or more internal service codes such as BRAKE_CHECK, PERIODIC_10K, CLUTCH_ADJUST, AC_SERVICE
}`;

  const prompt = `${systemContext}\n\nUser message: ${userMessage}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text() || '';
    const trimmed = raw.trim();

    // Ensure we only parse the JSON part if the model accidentally adds text
    const jsonStart = trimmed.indexOf('{');
    const jsonEnd = trimmed.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('No JSON object in classifier response');
    }
    const jsonText = trimmed.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonText);

    return {
      issue_intent: typeof parsed.issue_intent === 'string' ? parsed.issue_intent : 'unknown',
      booking_intent: Boolean(parsed.booking_intent),
      clarity: parsed.clarity === 'clear' ? 'clear' : 'unclear',
      service_codes_guess: Array.isArray(parsed.service_codes_guess)
        ? parsed.service_codes_guess.map((x: any) => String(x))
        : []
    };
  } catch (err) {
    // On any failure, fall back to a neutral result so keyword heuristics can still run
    return {
      issue_intent: 'unknown',
      booking_intent: false,
      clarity: 'unclear',
      service_codes_guess: []
    };
  }
}

async function callPredictiveMaintenance(customer_id: string, vin: string) {
  const res = await axios.post(`${BACKEND_BASE}/predict-maintenance`, { customer_id, vin });
  return res.data;
}

async function callDealershipRanking(payload: {
  customer_id: string;
  vin: string;
  service_codes_requested: string[];
  coordinates?: { lat: number; lng: number };
}) {
  const res = await axios.post(`${BACKEND_BASE}/dealerships/rank`, payload);
  return res.data;
}

async function callInventoryCheck(payload: { dealership_id: string; inventory_needed: string[] }) {
  const res = await axios.post(`${BACKEND_BASE}/inventory/check`, payload);
  return res.data;
}

async function callAppointmentBook(payload: any) {
  const res = await axios.post(`${BACKEND_BASE}/appointments/book`, payload);
  return res.data;
}

router.post('/session', (req: Request, res: Response) => {
  const { customer_id, vin } = req.body as { customer_id?: string; vin?: string };
  const id = uuidv4();
  const state: ChatSessionState = { id, customer_id, vin };
  sessions.set(id, state);

  return res.status(201).json({
    session_id: id,
    message: 'Chat session created for SheNergy assistant in Bangalore.'
  });
});


/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat and support
 */

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: Unauthorized
 */
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { session_id, message, customer_id, vin, selected_service_codes } = req.body as {
      session_id?: string;
      message: string;
      customer_id?: string;
      vin?: string;
      selected_service_codes?: string[];
    };

    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    let session: ChatSessionState | undefined;
    if (session_id && sessions.has(session_id)) {
      session = sessions.get(session_id);
    } else {
      const id = uuidv4();
      session = { id, customer_id, vin };
      sessions.set(id, session);
    }

    // Update identifiers if provided
    if (customer_id) session!.customer_id = customer_id;
    if (vin) session!.vin = vin;

    const lowerMsg = message.toLowerCase();

    // First, try a Gemini-based intent classification
    const classified = await classifyIntent(message);

    // Very lightweight intent flags to make the flow more robust
    const issueKeywords = [
      'pickup',
      'pick up',
      'power',
      'brake',
      'break',
      'spongy',
      'clutch',
      'service',
      'pad',
      'ac',
      'a/c',
      'air conditioning',
      'aircon'
    ];
    const bookingKeywords = ['book', 'booking', 'appointment', 'schedule'];

    // Combine classifier output with simple keyword fallbacks.
    // For booking, be conservative: only treat as booking intent when the user explicitly
    // mentions booking-related words in the text so that messages like
    // "I need help with my brakes" stay in clarification mode.
    let hasIssueIntent =
      classified.issue_intent !== 'unknown' || issueKeywords.some((kw) => lowerMsg.includes(kw));
    const hasBookingKeyword = bookingKeywords.some((kw) => lowerMsg.includes(kw));
    let hasBookingIntent = hasBookingKeyword;

    // Handle delay confirmation flow first
    if (session!.pendingInventoryCheck) {
      const saysYes =
        /\byes\b/.test(lowerMsg) ||
        /\bi can wait\b/.test(lowerMsg) ||
        /\bok to wait\b/.test(lowerMsg) ||
        (lowerMsg.includes('ok') && !/not ok|not okay/.test(lowerMsg)) ||
        /\bfine with (the )?delay\b/.test(lowerMsg)

      const saysNo =
        /\bno\b/.test(lowerMsg) ||
        /not ok/.test(lowerMsg) ||
        /not okay/.test(lowerMsg) ||
        /can't wait/.test(lowerMsg) ||
        /cannot wait/.test(lowerMsg) ||
        /need it as soon as possible/.test(lowerMsg)

      if (saysYes && !saysNo) {
        // User accepts delay -> keep the same rankings but acknowledge the delay acceptance.
        const { rankingPayload, dealership_id } = session!.pendingInventoryCheck as any;
        const ranking = await callDealershipRanking(rankingPayload);

        // Tag the dealership that had missing parts so the frontend can show
        // a clear parts-missing warning in the ranked list.
        if (Array.isArray(ranking.rankings)) {
          ranking.rankings = ranking.rankings.map((r: any) => {
            if (r.dealership_id === dealership_id) {
              const reason = String(r.reason || '');
              const note = 'Parts missing for some requested items; may require wait for parts.';
              return {
                ...r,
                reason: reason.includes('Parts missing') ? reason : `${reason ? reason + ' ' : ''}${note}`,
              };
            }
            return r;
          });
        }
        session!.pendingInventoryCheck = undefined;
        const reply = await generateReply(
          'The user has accepted a possible delay due to parts availability. Confirm this in friendly language, remind them that dealerships have been ranked using factors like expertise, availability, and customer feedback, and tell them they can now choose an exact slot on the appointments page. Do NOT say that an appointment is already booked.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          rankings: ranking.rankings
        });
      }

      if (saysNo && !saysYes) {
        // User rejects delay -> re-run ranking (same payload), so that other dealerships are suggested.
        const { rankingPayload, dealership_id } = session!.pendingInventoryCheck as any;
        const ranking = await callDealershipRanking(rankingPayload);

        if (Array.isArray(ranking.rankings)) {
          // First, append a parts-missing note to the affected dealership so the
          // frontend can render a warning badge.
          let missingDealer: any | null = null;
          const others: any[] = [];

          for (const r of ranking.rankings) {
            if (r.dealership_id === dealership_id) {
              const reason = String(r.reason || '');
              const note = 'Parts missing for some requested items; may require wait for parts.';
              const updated = {
                ...r,
                // Light score penalty when the user does NOT accept the delay
                // so that this option naturally sinks in the ordering.
                score: typeof r.score === 'number' ? r.score * 0.8 : r.score,
                reason: reason.includes('Parts missing') ? reason : `${reason ? reason + ' ' : ''}${note}`,
              };
              missingDealer = updated;
            } else {
              others.push(r);
            }
          }

          // Rebuild the rankings so that the parts-missing dealership appears last.
          ranking.rankings = missingDealer ? [...others, missingDealer] : others;
        }
        session!.pendingInventoryCheck = undefined;
        const reply = await generateReply(
          'The user is not okay with a delay due to parts shortage. Explain that you will not confirm a delayed option and are suggesting alternative Bangalore dealerships based on ranking so they can pick a slot on the appointments page.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          rankings: ranking.rankings
        });
      }

      // If unclear, prompt again
      const reply = await generateReply(
        'Ask the user politely if they are okay with a delay in service due to parts availability in Bangalore. Request a clear YES or NO.',
        message
      );
      return res.status(200).json({
        session_id: session!.id,
        reply
      });
    }

    // Predictive-maintenance-only flow: user explicitly asks for a predictive-based appointment.
    const predictiveIntentInText =
      lowerMsg.includes('predictive maintenance') || lowerMsg.includes('predictive-service');
    const hasPredictiveOnlyIntent =
      classified.issue_intent === 'predictive_service' || predictiveIntentInText;

    if (hasPredictiveOnlyIntent) {
      if (!session!.customer_id || !session!.vin) {
        const reply = await generateReply(
          'The user wants a predictive-maintenance-based appointment. Briefly ask them to confirm the customer ID and vehicle registration / VIN linked to their SheNergy account so you can look up their car. Keep it short.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply
        });
      }

      const predictive = await callPredictiveMaintenance(session!.customer_id, session!.vin);

      // If the user has already selected specific predictive services, treat this as booking.
      const hasSelectedCodes = Array.isArray(selected_service_codes) && selected_service_codes.length > 0;

      if (!hasSelectedCodes) {
        const reply = await generateReply(
          'You are an automotive assistant in Bangalore. The user has asked for a predictive-maintenance-based appointment. You MUST clearly list the key recommended services by concrete, human-friendly names such as "Periodic Service - 20,000 km", "Brake Inspection & Pad Check", "AC System Check" or similar, instead of vague phrases like "predictive service" or "recommended service". For each, briefly indicate how urgent it is (for example Urgent / Soon / Can wait), then ask the user which specific services they would like to include. Keep it concise and do not show internal IDs.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          recommendations: predictive.recommendations
        });
      }

      // Booking branch for predictive-only when the user has selected specific predictive services.
      const effectiveServiceCodes = selected_service_codes!;
      const rankingPayload = {
        customer_id: session!.customer_id,
        vin: session!.vin,
        service_codes_requested: effectiveServiceCodes
      };
      const ranking = await callDealershipRanking(rankingPayload);
      const top = ranking.rankings[0];

      const inventory_needed = effectiveServiceCodes.map((code: string) => {
        if (code.startsWith('PERIODIC')) return 'Engine Oil 5W30';
        if (code.startsWith('BRAKE')) return 'Brake Pads Front';
        if (code.startsWith('CLUTCH')) return 'Clutch Plate Assembly';
        return 'Engine Oil 5W30';
      });

      const inventoryResult = await callInventoryCheck({
        dealership_id: top.dealership_id,
        inventory_needed
      });

      if (!inventoryResult.inventory_ok) {
        session!.pendingInventoryCheck = {
          dealership_id: top.dealership_id,
          inventory_needed,
          rankingPayload
        };
        const reply = await generateReply(
          `Explain that for the predictive maintenance services the user selected, some parts are not currently in stock at the chosen dealership. Mention a rough delay window based on the inventory system (for example ${
            inventoryResult.estimated_delay_days ?? 3
          } days), and ask in one short sentence if they are okay with that delay.`,
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          selected_dealership: top,
          recommendations: predictive.recommendations
        });
      }

      const reply = await generateReply(
        'Confirm in friendly language that you have used the predictive maintenance recommendations the user selected to rank nearby Bangalore dealerships. Briefly describe that the list is ordered by factors like expertise, availability, and customer feedback. Make it explicit that some individual dealerships may have slightly longer wait times if certain parts are low or out of stock, and that on the Appointments page these dealers will be clearly marked with a delay / possible-wait label so the user can decide whether to accept that delay or choose another dealership. Do NOT say that an appointment has already been booked.',
        message
      );
      return res.status(200).json({
        session_id: session!.id,
        reply,
        recommendations: predictive.recommendations,
        rankings: ranking.rankings
      });
    }

    // If user describes issues, first trigger predictive maintenance.
    // Only when a clear booking intent is detected do we move on to ranking + inventory + booking.
    if (hasIssueIntent) {
      if (!session!.customer_id || !session!.vin) {
        const reply = await generateReply(
          'Explain briefly that you are unable to find their saved vehicle details and ask them to confirm the customer ID and vehicle registration / VIN linked to their SheNergy account so you can proceed. Do not ask for make or model; focus only on identifiers you can use to look up their record.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply
        });
      }

      const predictive = await callPredictiveMaintenance(session!.customer_id, session!.vin);
      const criticalRecs = predictive.recommendations.filter(
        (r: any) => r.urgency_label === 'urgent' || r.priority === 1
      );
      const recommendedCodes = predictive.recommendations.map((r: any) => r.service_code);

      // If the user has not clearly asked to book yet, keep the conversation issue-first.
      // Use clarificationCount to allow up to two short follow-up questions before
      // moving on to a comfort message / predictive suggestions.
      if (!hasBookingIntent) {
        const clarificationCount = session!.clarificationCount ?? 0;
        // First clarification question: broad categorisation of the problem.
        if (clarificationCount === 0) {
          const reply = await generateReply(
            'You are an automotive assistant in Bangalore. The user has described an issue. Ask ONE short, simple follow-up question to better understand the problem (for example whether it relates more to brakes, AC, engine power, or something else). Do not list predictive maintenance services yet and keep the message brief. End with a clear question mark.',
            message
          );
          session!.clarificationCount = 1;
          return res.status(200).json({
            session_id: session!.id,
            reply
          });
        }

        // Second clarification question: a tighter follow-up based on the last answer.
        if (clarificationCount === 1 && !session!.hasShownPredictiveCritical) {
          const reply = await generateReply(
            'You are an automotive assistant in Bangalore. The user has already answered an initial clarifying question about their car issue. Ask ONE more very short follow-up question that clearly builds on their latest answer. Focus on clarifying WHEN and HOW the symptom appears (for example only at night, only on bumps, only at higher speeds), how consistent it is, or whether there are related signals like unusual noises, smells, or warning lights. Do NOT introduce unrelated aspects such as steering or turning if the user did not mention them, do NOT repeat their previous answer, do NOT restate the same question, and make sure you end with a single clear question. Do not mention predictive maintenance yet.',
            message
          );
          session!.clarificationCount = 2;
          return res.status(200).json({
            session_id: session!.id,
            reply
          });
        }

        // Only start talking about critical predictive items after one clarification
        // round and when we actually have critical recommendations, and only once.
        if (criticalRecs.length && !session!.hasShownPredictiveCritical) {
          const reply = await generateReply(
            'You are an automotive assistant in Bangalore. The user has already described their issue and you now have enough information to understand it and map it to the right kind of service. Start with one short, comforting sentence acknowledging this (for example: \'Thanks, that helps — I have enough info to understand the problem and pick the right type of service.\'). Then say that the predictive maintenance engine has also found some urgent items for this vehicle. You MUST clearly name these 1–3 services using concrete, human-friendly names such as "Periodic Service - 20,000 km", "Brake Inspection & Pad Check", "AC System Check" or similar, and avoid vague labels like "predictive service" or "recommended service". Indicate briefly how critical each one is. Finally, in one short sentence, ask the user which of these urgent items they would like to add to their booking, without over-explaining.',
            message
          );
          session!.hasShownPredictiveCritical = true;
          return res.status(200).json({
            session_id: session!.id,
            reply,
            recommendations: criticalRecs
          });
        }

        // No critical predictive items even after clarifications: stay focused on the
        // described issue and let future turns decide whether to look at medium-priority
        // predictive maintenance.
        const reply = await generateReply(
          'You are an automotive assistant in Bangalore. Acknowledge briefly that you understand the user\'s issue and are ready to suggest the right type of service for it. Keep the message short and focused on their described problem, without listing predictive maintenance services yet.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply
        });
      }

      // From here on, the user has both described an issue and expressed booking intent.
      const effectiveServiceCodes =
        Array.isArray(selected_service_codes) && selected_service_codes.length
          ? selected_service_codes
          : recommendedCodes;

      const rankingPayload = {
        customer_id: session!.customer_id,
        vin: session!.vin,
        service_codes_requested: effectiveServiceCodes
      };
      const ranking = await callDealershipRanking(rankingPayload);
      const top = ranking.rankings[0];

      // For prototype, use a simple inventory_needed list derived from codes
      const inventory_needed = effectiveServiceCodes.map((code: string) => {
        if (code.startsWith('PERIODIC')) return 'Engine Oil 5W30';
        if (code.startsWith('BRAKE')) return 'Brake Pads Front';
        if (code.startsWith('CLUTCH')) return 'Clutch Plate Assembly';
        return 'Engine Oil 5W30';
      });

      const inventoryResult = await callInventoryCheck({
        dealership_id: top.dealership_id,
        inventory_needed
      });

      if (!inventoryResult.inventory_ok) {
        session!.pendingInventoryCheck = {
          dealership_id: top.dealership_id,
          inventory_needed,
          rankingPayload
        };
        const reply = await generateReply(
          `Inform the user that some required parts are currently unavailable at the selected Bangalore dealership and mention an approximate delay based on the inventory system (for example ${
            inventoryResult.estimated_delay_days ?? 3
          } days). Ask if they are okay with that delay in one short question.`,
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          selected_dealership: top,
          recommendations: predictive.recommendations
        });
      }

      const reply = await generateReply(
        'Explain to the user that based on their described issues and the predictive maintenance recommendations, you have selected suitable services and ranked nearby dealerships in Bangalore using metrics like expertise, availability, and customer feedback. Make it clear that some specific dealerships may have a longer wait if parts are limited, and that on the Appointments page those options will be explicitly tagged with a possible delay label so the user can either accept that wait or pick a different dealership. Do NOT say that an appointment has already been booked.',
        message
      );
      return res.status(200).json({
        session_id: session!.id,
        reply,
        recommendations: predictive.recommendations,
        rankings: ranking.rankings
      });
    }

    // Default casual response
    let systemContext: string;
    if (!session!.hasIntroduced) {
      systemContext =
        'Introduce yourself once as the SheNergy automotive assistant for Bangalore and, in a single short paragraph, invite the user to describe in their own words what is happening with their car (for example issues with braking, performance, AC cooling, strange noises, warning lights, etc.). Emphasise that you can both suggest the right services and help them book an appointment. Do not list a fixed set of issues and do not repeat this long introduction again in future turns.';
      session!.hasIntroduced = true;
    } else {
      systemContext =
        'Respond as the SheNergy automotive assistant in Bangalore in a short, friendly way. Do not reintroduce yourself; just ask one or two focused follow-up questions or gently guide the user to describe their car issues so you can suggest services and offer to book an appointment.';
    }

    const reply = await generateReply(systemContext, message);
    return res.status(200).json({
      session_id: session!.id,
      reply
    });
  } catch (err) {
    return res.status(500).json({ message: 'Chat handler error', error: (err as Error).message });
  }
});

export default router;
