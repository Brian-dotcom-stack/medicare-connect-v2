import { supabase } from "@/integrations/supabase/client";

/**
 * Seeds a new organisation with fictional demo data so dashboards render meaningfully.
 * All names, addresses and details are entirely fictional — safe for public demos.
 */
export async function seedFictionalOrgData(orgId: string): Promise<void> {
  const { data: staffRows, error: sErr } = await supabase
    .from("staff")
    .insert([
      { org_id: orgId, name: "Amelia Hart", email: "amelia.hart@example.org", role: "manager", job_title: "Care Manager", phone: "+44 20 7946 0100", active: true },
      { org_id: orgId, name: "Jordan Reyes", email: "jordan.reyes@example.org", role: "staff", job_title: "Senior Carer", phone: "+44 20 7946 0101", active: true },
      { org_id: orgId, name: "Priya Shah", email: "priya.shah@example.org", role: "staff", job_title: "Care Assistant", phone: "+44 20 7946 0102", active: true },
      { org_id: orgId, name: "Marcus Bell", email: "marcus.bell@example.org", role: "staff", job_title: "Care Assistant", phone: "+44 20 7946 0103", active: true },
    ])
    .select();
  if (sErr) throw sErr;

  const { data: clientRows, error: cErr } = await supabase
    .from("clients")
    .insert([
      { org_id: orgId, name: "Edith Whitmore", date_of_birth: "1938-04-12", address: "14 Rose Cottage Lane, Willowbrook", key_contact: "Daughter — Sarah Whitmore", care_level: "high", notes: "Prefers morning visits. Enjoys classical music." },
      { org_id: orgId, name: "Harold Pemberton", date_of_birth: "1942-11-03", address: "27 Old Mill Road, Northlake", key_contact: "Son — David Pemberton", care_level: "medium", notes: "Diabetic. Insulin twice daily." },
      { org_id: orgId, name: "Beatrice Nkomo", date_of_birth: "1945-07-21", address: "8 Chestnut Avenue, Willowbrook", key_contact: "Nephew — Chidi Nkomo", care_level: "low", notes: "Independent, needs light domestic support." },
      { org_id: orgId, name: "Frank Osei", date_of_birth: "1936-01-30", address: "3 Meadow View, Northlake", key_contact: "Wife — Grace Osei", care_level: "high", notes: "Mobility support required." },
    ])
    .select();
  if (cErr) throw cErr;

  const staff = staffRows ?? [];
  const clients = clientRows ?? [];
  if (staff.length === 0 || clients.length === 0) return;

  const today = new Date();
  const shifts: { org_id: string; staff_id: string; client_id: string; date: string; start_time: string; end_time: string; status: "scheduled" | "completed" | "cancelled" }[] = [];
  for (let d = 0; d < 7; d++) {
    const day = new Date(today);
    day.setDate(day.getDate() + d);
    const date = day.toISOString().slice(0, 10);
    clients.forEach((c, i) => {
      const st = staff[(i + d) % staff.length];
      shifts.push({
        org_id: orgId,
        staff_id: st.id,
        client_id: c.id,
        date,
        start_time: i % 2 === 0 ? "08:00" : "14:00",
        end_time: i % 2 === 0 ? "11:00" : "17:00",
        status: "scheduled",
      });
    });
  }
  await supabase.from("shifts").insert(shifts);

  const meds: { org_id: string; client_id: string; name: string; dose: string; schedule: string[]; notes: string }[] = [];
  meds.push({ org_id: orgId, client_id: clients[0].id, name: "Donepezil", dose: "10mg", schedule: ["08:00"], notes: "Take with breakfast." });
  meds.push({ org_id: orgId, client_id: clients[1].id, name: "Metformin", dose: "500mg", schedule: ["08:00", "20:00"], notes: "With meals." });
  meds.push({ org_id: orgId, client_id: clients[1].id, name: "Insulin (short-acting)", dose: "6 units", schedule: ["08:00", "18:00"], notes: "Check blood glucose first." });
  meds.push({ org_id: orgId, client_id: clients[3].id, name: "Amlodipine", dose: "5mg", schedule: ["08:00"], notes: "" });
  await supabase.from("medications").insert(meds);

  await supabase.from("incidents").insert([
    { org_id: orgId, client_id: clients[0].id, reported_by: staff[1].id, severity: "medium", title: "Minor fall in hallway", description: "Resident stumbled near the hallway rug. No injuries, GP notified.", status: "investigating" },
    { org_id: orgId, client_id: clients[3].id, reported_by: staff[2].id, severity: "low", title: "Missed medication window", description: "Amlodipine given 40 minutes late due to visit delay. Documented.", status: "resolved" },
  ]);
}
