import { r as __toESM } from "../_runtime.mjs";
import { S as Button, U as cn, f as saveRecord, o as deleteRecord } from "./queries-BRGPrPxK.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { l as Pencil, r as Trash2, s as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CrudSection-Wn7twfrB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function toInput(value, type) {
	if (type === "checkbox") return Boolean(value);
	if (value === null || value === void 0) return "";
	if (type === "list") return Array.isArray(value) ? value.join(", ") : String(value);
	if (type === "money") return String(Number(value) / 100);
	if (type === "datetime") {
		const d = new Date(String(value));
		if (Number.isNaN(d.getTime())) return "";
		const pad = (n) => String(n).padStart(2, "0");
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}
	return String(value);
}
function fromInput(raw, type) {
	if (type === "checkbox") return Boolean(raw);
	const value = String(raw);
	if (type === "list") return value.split(",").map((v) => v.trim()).filter(Boolean);
	if (value === "") return null;
	if (type === "money") return Math.round(Number(value) * 100);
	if (type === "number") return Number(value);
	if (type === "datetime") return new Date(value).toISOString();
	return value;
}
function CrudSection({ table, title, description, rows, fields, primaryField, secondaryField, singular, allowCreate = true, allowDelete = true }) {
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-panel p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: description
				}) : null] }), allowCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setEditing("new"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "size-4",
							"aria-hidden": true
						}),
						" Add ",
						singular
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-5 divide-y divide-border/70",
				children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-4 text-sm text-muted-foreground",
					children: "Nothing here yet."
				}) : null, rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: String(row[primaryField] ?? "—")
						}), secondaryField ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: secondaryField(row)
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							"aria-label": "Edit",
							onClick: () => setEditing(row),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								className: "size-4",
								"aria-hidden": true
							})
						}), allowDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteButton, {
							table,
							id: row.id
						}) : null]
					})]
				}, row.id))]
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				table,
				singular,
				fields,
				row: editing === "new" ? null : editing,
				onClose: () => setEditing(null)
			}) : null
		]
	});
}
function DeleteButton({ table, id }) {
	const qc = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "icon",
		variant: "outline",
		"aria-label": "Delete",
		disabled: busy,
		onClick: async () => {
			if (!window.confirm("Delete this entry? This cannot be undone.")) return;
			setBusy(true);
			try {
				await deleteRecord({ data: {
					table,
					id
				} });
				await qc.invalidateQueries({ queryKey: ["admin"] });
				toast.success("Deleted");
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Could not delete");
			} finally {
				setBusy(false);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
			className: "size-4",
			"aria-hidden": true
		})
	});
}
function RecordDialog({ table, singular, fields, row, onClose }) {
	const qc = useQueryClient();
	const [state, setState] = (0, import_react.useState)(() => Object.fromEntries(fields.map((f) => [f.name, toInput(row?.[f.name], f.type ?? "text")])));
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		setBusy(true);
		try {
			const values = Object.fromEntries(fields.map((f) => [f.name, fromInput(state[f.name] ?? "", f.type ?? "text")]));
			await saveRecord({ data: {
				table,
				...row ? { id: row.id } : {},
				values
			} });
			await qc.invalidateQueries({ queryKey: ["admin"] });
			await qc.invalidateQueries({ queryKey: ["site"] });
			toast.success("Saved");
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => open ? null : onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl",
					children: row ? `Edit ${singular}` : `Add ${singular}`
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: fields.map((f) => {
						const type = f.type ?? "text";
						const id = `${table}-${f.name}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: f.full || type === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2",
							children: type === "checkbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 pt-6 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id,
									checked: Boolean(state[f.name]),
									onCheckedChange: (v) => setState((s) => ({
										...s,
										[f.name]: Boolean(v)
									}))
								}), f.label]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: id,
								children: f.label
							}), type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id,
								rows: 4,
								value: String(state[f.name] ?? ""),
								onChange: (e) => setState((s) => ({
									...s,
									[f.name]: e.target.value
								}))
							}) : type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id,
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								value: String(state[f.name] ?? ""),
								onChange: (e) => setState((s) => ({
									...s,
									[f.name]: e.target.value
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), (f.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o.value,
									children: o.label
								}, o.value))]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id,
								type: type === "number" || type === "money" ? "number" : type === "date" ? "date" : type === "time" ? "time" : type === "datetime" ? "datetime-local" : "text",
								step: type === "money" ? "0.01" : void 0,
								placeholder: f.placeholder ?? "",
								value: String(state[f.name] ?? ""),
								onChange: (e) => setState((s) => ({
									...s,
									[f.name]: e.target.value
								}))
							})] })
						}, f.name);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					disabled: busy,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: busy,
					children: busy ? "Saving…" : "Save"
				})] })
			]
		})
	});
}
//#endregion
export { RecordDialog as n, CrudSection as t };
