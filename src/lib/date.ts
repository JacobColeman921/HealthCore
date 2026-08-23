export const todayKey = () => new Date().toLocaleDateString("en-CA");
export const formatDate = (value = new Date()) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(value);
export const id = () => crypto.randomUUID();
