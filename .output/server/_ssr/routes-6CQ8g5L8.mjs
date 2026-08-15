import { r as __toESM } from "../_runtime.mjs";
import { C as DataRow, F as SectionHeading, I as __exportAll, P as Section, R as logo_exports, S as Button, T as GoldRule, l as panchangQuery, m as siteQuery, z as subscribeNewsletter } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Sunrise, g as ArrowRight, h as CalendarDays, i as Sunset, o as Sparkles } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./server-Cc0YOX7k.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as formatInTimezone } from "./timezone-BD2Gbves.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as ServiceCard, t as EventCard } from "./cards-TlQ8mL-q.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-6CQ8g5L8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewsletterSignup() {
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [volunteer, setVolunteer] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getUser().then(({ data }) => {
			if (!active) return;
			setSignedIn(Boolean(data.user));
			if (data.user?.email) setEmail(data.user.email);
		});
		return () => {
			active = false;
		};
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await subscribeNewsletter({ data: {
				email,
				...fullName ? { fullName } : {},
				...phone ? { phone } : {},
				wantsVolunteering: volunteer
			} });
			setDone(true);
			toast.success("You're subscribed to temple event updates.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not subscribe");
		} finally {
			setBusy(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl",
			children: "Thank you"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: ["You will receive news about upcoming poojas and festivals.", volunteer ? " Our team will contact you about volunteering." : ""]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl",
				children: "Event newsletter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Subscribe for festival announcements — and tell us if you would like to volunteer."
			}),
			signedIn === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					"Please",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { redirect: "/" },
						className: "text-primary underline",
						children: "sign in or create an account"
					}),
					" ",
					"to subscribe."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nl-name",
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nl-name",
							value: fullName,
							onChange: (e) => setFullName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nl-email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nl-email",
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nl-phone",
							children: "Phone (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nl-phone",
							value: phone,
							onChange: (e) => setPhone(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: volunteer,
							onCheckedChange: (v) => setVolunteer(Boolean(v)),
							id: "nl-volunteer"
						}), "I would like to volunteer at temple events"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || signedIn === null,
						className: "w-full",
						children: busy ? "Subscribing…" : "Subscribe"
					})
				]
			})
		]
	});
}
var temple_hero_1_exports = /* @__PURE__ */ __exportAll({ default: () => temple_hero_1_default });
var temple_hero_1_default = "/assets/temple-hero-1-Bs0qSYel.jpg";
var temple_hero_2_exports = /* @__PURE__ */ __exportAll({ default: () => temple_hero_2_default });
var temple_hero_2_default = "/assets/temple-hero-2-DTp26VZs.jpg";
var temple_hero_exports = /* @__PURE__ */ __exportAll({ default: () => temple_hero_default });
var temple_hero_default = "/assets/temple-hero-Be2RZu1Z.jpg";
var images = Object.values([
	logo_exports,
	temple_hero_1_exports,
	temple_hero_2_exports,
	temple_hero_exports
]).map((mod) => mod.default);
function RadixCarousel() {
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % images.length);
		}, 3e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
		value: String(activeIndex),
		onValueChange: (val) => setActiveIndex(Number(val)),
		className: "w-full",
		children: [images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
			value: String(index),
			className: "relative isolate overflow-hidden h-[45vh] min-h-[300px] max-h-[620px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 blur-2xl opacity-40",
				style: {
					backgroundImage: `url(${image})`,
					backgroundSize: "cover",
					backgroundPosition: "center"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: `Slide ${index + 1}`,
				className: "h-full w-full object-contain"
			})]
		}, index)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
			className: "flex justify-center space-x-2 mt-4",
			children: images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
				value: String(index),
				className: "w-3 h-3 rounded-full bg-gray-300 data-[state=active]:bg-blue-500",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: `Thumb ${index + 1}`,
					className: "w-full h-full object-cover"
				})
			}, index))
		})]
	});
}
function Home() {
	const { data } = useSuspenseQuery(siteQuery);
	const { data: panchang } = useSuspenseQuery(panchangQuery());
	const temple = data.temple;
	const tz = temple.timezone;
	const today = panchang.today;
	const featuredServices = data.services.filter((s) => s.is_active).slice(0, 6);
	const upcomingEvents = data.events.slice(0, 3);
	const announcement = data.announcements[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		announcement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-primary px-4 py-2.5 text-center text-sm text-primary-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: announcement.title
			}), announcement.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden sm:inline",
				children: [" — ", announcement.body]
			}) : null]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadixCarousel, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "temple-gradient relative overflow-hidden px-4 py-16 sm:px-6 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: [temple.city, temple.state].filter(Boolean).join(", ")
					}),
					temple.tagline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-lg text-muted-foreground",
						children: temple.tagline
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/services",
								children: ["Book a pooja ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "size-4",
									"aria-hidden": true
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/timings",
								children: "Temple timings"
							})
						})]
					}),
					data.deities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mb-3",
							children: "Deities worshipped here"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: data.deities.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: d.name
							}, d.id))
						})]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "surface-panel p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Today's Panchang"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-xl",
								children: formatInTimezone((/* @__PURE__ */ new Date()).toISOString(), tz, {
									weekday: "long",
									month: "long",
									day: "numeric"
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "size-6 text-primary",
								"aria-hidden": true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldRule, { className: "my-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Tithi",
								value: `${today.tithiName} (${today.paksha})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Nakshatra",
								value: today.nakshatraName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Yoga",
								value: today.yogaName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Masa",
								value: today.masaName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Sunrise / Sunset",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sunrise, {
											className: "size-3.5",
											"aria-hidden": true
										}),
										" ",
										today.sunrise,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sunset, {
											className: "size-3.5",
											"aria-hidden": true
										}),
										" ",
										today.sunset
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataRow, {
								label: "Rahu Kalam",
								value: today.rahuKalam
							})
						] }),
						today.observances.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 rounded-md bg-accent/60 px-3 py-2 text-sm text-accent-foreground",
							children: today.observances.join(" • ")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "mt-4 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/calendar",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
									className: "size-4",
									"aria-hidden": true
								}), " Full calendar"]
							})
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Sevas & Poojas",
			title: "Book a ceremony with our priests",
			description: "Choose a seva, pick a time that suits you, and we confirm a priest instantly — no phone tag required.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/services",
					children: "View all services"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: featuredServices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
				service: s,
				currency: temple.currency
			}, s.id))
		})] }),
		upcomingEvents.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			tone: "muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Community",
				title: "Upcoming events & festivals",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/events",
						children: "All events"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: upcomingEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
					event: e,
					timezone: tz
				}, e.id))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Stay connected",
				title: "Subscribe to temple event updates",
				description: "Receive festival announcements and pooja schedules, and let us know if you would like to volunteer at our events."
			}), data.eventPhotos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: data.eventPhotos.slice(0, 6).map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo.image_url,
					alt: photo.title ?? "Past temple event",
					loading: "lazy",
					className: "h-28 w-full rounded-lg object-cover"
				}, photo.id))
			}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterSignup, {})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			tone: "accent",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-center gap-8 md:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-4xl",
					children: "Support the temple"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-muted-foreground",
					children: "Your contributions sustain daily worship, festivals, priest services, and cultural education for the next generation."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 md:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/donate",
							children: "Donate now"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							children: "Contact us"
						})
					})]
				})]
			})
		})
	] });
}
//#endregion
export { Home as component };
