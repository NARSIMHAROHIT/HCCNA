import { queryOptions } from "@tanstack/react-query";

import {
  getBooks,
  getEventBySlug,
  getPanchang,
  getPriestDirectory,
  getServiceBySlug,
  getSiteData,
} from "./temple.functions";
import { getServiceAvailability } from "./booking.functions";
import { getAdminData, getAdminPeople, getAuditLog } from "./admin.functions";

export const siteQuery = queryOptions({
  queryKey: ["site"],
  queryFn: () => getSiteData(),
  staleTime: 60_000,
});

export const priestsQuery = queryOptions({
  queryKey: ["priests"],
  queryFn: () => getPriestDirectory(),
  staleTime: 60_000,
});

export const booksQuery = queryOptions({
  queryKey: ["books"],
  queryFn: () => getBooks(),
  staleTime: 60_000,
});

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const eventQuery = (slug: string) =>
  queryOptions({
    queryKey: ["event", slug],
    queryFn: () => getEventBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const panchangQuery = (year?: number, month?: number) =>
  queryOptions({
    queryKey: ["panchang", year ?? "now", month ?? "now"],
    queryFn: () =>
      getPanchang({
        data: {
          ...(year !== undefined ? { year } : {}),
          ...(month !== undefined ? { month } : {}),
        },
      }),
    staleTime: 5 * 60_000,
  });

export const availabilityQuery = (serviceSlug: string, date: string) =>
  queryOptions({
    queryKey: ["availability", serviceSlug, date],
    queryFn: () => getServiceAvailability({ data: { serviceSlug, date } }),
    staleTime: 15_000,
  });

export const adminQuery = queryOptions({
  queryKey: ["admin"],
  queryFn: () => getAdminData(),
  staleTime: 10_000,
});

export const auditQuery = queryOptions({
  queryKey: ["admin", "audit"],
  queryFn: () => getAuditLog(),
  staleTime: 10_000,
});

export const adminPeopleQuery = queryOptions({
  queryKey: ["admin", "people"],
  queryFn: () => getAdminPeople(),
  staleTime: 10_000,
});
