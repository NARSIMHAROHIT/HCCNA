import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMyDashboard, updateMyProfile } from "@/lib/booking.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — HCCNA" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const fetchDashboard = useServerFn(getMyDashboard);
  const save = useServerFn(updateMyProfile);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDashboard() });

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    if (!data?.profile) return;
    setForm({
      full_name: data.profile.full_name ?? "",
      phone: data.profile.phone ?? "",
      address: data.profile.address ?? "",
      city: data.profile.city ?? "",
      state: data.profile.state ?? "",
      postal_code: data.profile.postal_code ?? "",
    });
  }, [data?.profile]);

  const mutation = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
  });

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Devotee portal"
        title="My profile"
        description="Used to pre-fill your bookings."
      />
      <Section>
        <form
          className="mx-auto max-w-xl space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          {field("full_name", "Full name")}
          {field("phone", "Phone", "tel")}
          {field("address", "Address")}
          <div className="grid gap-5 sm:grid-cols-3">
            {field("city", "City")}
            {field("state", "State")}
            {field("postal_code", "ZIP")}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            Save changes
          </Button>
        </form>
      </Section>
    </>
  );
}
