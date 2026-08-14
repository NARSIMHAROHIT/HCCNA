import { r as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section, t as Button } from "./router-FwX4_uf4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as updateMyProfile, o as useServerFn, r as getMyDashboard } from "./booking.functions-DF3vcD-j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-j8pyqH76.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const fetchDashboard = useServerFn(getMyDashboard);
	const save = useServerFn(updateMyProfile);
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fetchDashboard()
	});
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		postal_code: ""
	});
	(0, import_react.useEffect)(() => {
		if (!data?.profile) return;
		setForm({
			full_name: data.profile.full_name ?? "",
			phone: data.profile.phone ?? "",
			address: data.profile.address ?? "",
			city: data.profile.city ?? "",
			state: data.profile.state ?? "",
			postal_code: data.profile.postal_code ?? ""
		});
	}, [data?.profile]);
	const mutation = useMutation({
		mutationFn: () => save({ data: form }),
		onSuccess: () => {
			toast.success("Profile updated");
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save")
	});
	const field = (key, label, type = "text") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: key,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: key,
			type,
			value: form[key],
			onChange: (e) => setForm((prev) => ({
				...prev,
				[key]: e.target.value
			}))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Devotee portal",
		title: "My profile",
		description: "Used to pre-fill your bookings."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto max-w-xl space-y-5",
		onSubmit: (e) => {
			e.preventDefault();
			mutation.mutate();
		},
		children: [
			field("full_name", "Full name"),
			field("phone", "Phone", "tel"),
			field("address", "Address"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-3",
				children: [
					field("city", "City"),
					field("state", "State"),
					field("postal_code", "ZIP")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: mutation.isPending,
				children: "Save changes"
			})
		]
	}) })] });
}
//#endregion
export { ProfilePage as component };
