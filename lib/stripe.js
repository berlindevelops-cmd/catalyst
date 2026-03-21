import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// use service role key for webhook — bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.user_id;

        if (session.mode === "subscription") {
          const plan = session.metadata.plan;
          const subscription = await stripe.subscriptions.retrieve(session.subscription);

          await supabaseAdmin.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            status: "active",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        }

        if (session.mode === "payment") {
          const boostType = session.metadata.boost_type;
          const jobId = session.metadata.job_id;

          // set expiry based on boost type
          const expiresAt = new Date();
          if (boostType === "urgent_hire") expiresAt.setHours(expiresAt.getHours() + 48);
          else if (boostType === "featured_profile") expiresAt.setDate(expiresAt.getDate() + 7);
          else expiresAt.setDate(expiresAt.getDate() + 30);

          await supabaseAdmin.from("boosts").insert({
            user_id: userId,
            job_id: jobId || null,
            type: boostType,
            stripe_payment_intent_id: session.payment_intent,
            status: "active",
            expires_at: expiresAt.toISOString(),
          });

          // if urgent hire, mark job as urgent
          if (boostType === "urgent_hire" && jobId) {
            await supabaseAdmin.from("jobs").update({ urgent: true }).eq("id", jobId);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.supabase_user_id;

        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          status: subscription.status === "active" ? "active" : "past_due",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.supabase_user_id;

        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };