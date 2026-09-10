import { createAdminClient } from "@/lib/supabase/admin";
import type { EventItem, EventRow } from "@/lib/types";
import { formatDate, formatDateParts, formatNameList } from "@/lib/format";
import { Countdown } from "./countdown";
import { RsvpButtons } from "./rsvp-buttons";
import { InvitationReveal } from "./invitation-reveal";

type ItemWithEvent = EventItem & {
  event_categories: { events: EventRow | null } | null;
};

type WordStyle = { word: string; className: string };

function highlightWords(text: string, rules: WordStyle[]) {
  const pattern = new RegExp(`(${rules.map((r) => r.word).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const rule = rules.find((r) => r.word.toLowerCase() === part.toLowerCase());
    return rule ? (
      <span key={i} className={rule.className}>
        {part}
      </span>
    ) : (
      part
    );
  });
}

function InviteCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-gold/30 bg-white/70 px-6 py-10 text-center shadow-[0_20px_45px_-25px_rgba(69,79,49,0.45)] backdrop-blur-sm sm:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

export default async function InvitacionPage(props: PageProps<"/invitacion/[code]">) {
  const { code } = await props.params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("event_items")
    .select("*, event_categories(events(*))")
    .eq("rsvp_code", code)
    .maybeSingle();

  const item = data as ItemWithEvent | null;
  const event = item?.event_categories?.events ?? null;

  if (!item || !event) {
    return (
      <InviteCard>
        <p className="font-display text-xl italic text-olive-dark">Invitación no encontrada</p>
        <p className="mt-2 text-sm text-olive">
          Revisa que el enlace esté completo, o pregúntale a la pareja por tu invitación.
        </p>
      </InviteCard>
    );
  }

  const mapQuery = event.venue_address ? encodeURIComponent(event.venue_address) : null;
  const googleMapsUrl = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}` : null;
  const guestNames = formatNameList([item.name, ...(item.additional_guest_names ?? [])]);
  const dateParts = event.event_date ? formatDateParts(event.event_date) : null;
  const showMessage = Boolean(event.welcome_message || event.welcome_message_highlight);
  const showVenue = Boolean(event.venue_name || event.venue_address);
  const showDetails = Boolean(event.dress_code || event.gift_note);
  // La portada "Nos casamos" siempre va primera, así que solo ella necesita
  // cancelar el padding superior del layout (py-10/py-16).
  const heroTopOffset = "-mt-10 sm:-mt-16";

  return (
    <InvitationReveal eventTitle={event.title} guestName={guestNames} partySize={item.party_size}>
      <div className="space-y-3">
        <section
          className={`relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8 ${heroTopOffset}`}
        >
          <div className="max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">Nos casamos</p>
            <p className="mt-4 font-script text-6xl text-ivory sm:text-7xl lg:text-8xl">
              {event.couple_names ?? event.title}
            </p>

            {dateParts && (
              <>
                <div className="my-8 flex items-center justify-center gap-3">
                  <span className="h-px w-16 bg-gold/40 lg:w-24" />
                  <span className="text-gold">✿</span>
                  <span className="h-px w-16 bg-gold/40 lg:w-24" />
                </div>
                <p className="font-display text-2xl tracking-wide text-gold sm:text-3xl lg:text-4xl">
                  {dateParts.day} · {dateParts.month} · {dateParts.year}
                </p>
              </>
            )}
          </div>

          <div className="absolute bottom-6 flex flex-col items-center gap-1 text-gold/80">
            <span className="text-[10px] uppercase tracking-[0.3em]">Desliza</span>
            <span className="animate-bounce text-lg leading-none">⌄</span>
          </div>
        </section>

        {showMessage && (
          <section className="relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8">
            <div className="relative max-w-2xl overflow-hidden rounded-3xl border border-gold/50 bg-white/40 px-8 py-14 text-center shadow-[0_20px_45px_-25px_rgba(69,79,49,0.45)] backdrop-blur-sm sm:px-14 sm:py-16 lg:px-20 lg:py-20">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 -top-8 font-display text-9xl italic text-gold/50"
              >
                “
              </span>
              {event.welcome_message && (
                <p className="relative text-base italic leading-relaxed whitespace-pre-line text-olive-dark sm:text-lg lg:text-xl">
                  {event.welcome_message}
                </p>
              )}
              {event.welcome_message_highlight && (
                <>
                  <div className="my-5 flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-gold/40" />
                    <span className="text-gold-deep">◆</span>
                    <span className="h-px w-10 bg-gold/40" />
                  </div>
                  <p className="relative font-display text-2xl italic tracking-wide text-olive-dark sm:text-3xl lg:text-4xl">
                    {event.welcome_message_highlight}
                  </p>
                </>
              )}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-14 -right-2 font-display text-9xl italic text-gold/50"
              >
                ”
              </span>
            </div>

            <div className="absolute bottom-6 flex flex-col items-center gap-1 text-gold/80">
              <span className="text-[10px] uppercase tracking-[0.3em]">Desliza</span>
              <span className="animate-bounce text-lg leading-none">⌄</span>
            </div>
          </section>
        )}

        {dateParts && (
          <section className="relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8">
            <div className="max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">
                Reserva la fecha
              </p>

              <div className="mt-6 flex items-center justify-center gap-4 sm:gap-8 lg:gap-12">
                <p className="text-xs uppercase tracking-[0.25em] text-ivory/70 sm:text-sm lg:text-base">
                  {dateParts.weekday}
                </p>
                <span className="h-14 w-px bg-gold/40 sm:h-16 lg:h-20" />
                <p className="font-display text-7xl text-ivory sm:text-8xl lg:text-9xl">
                  {dateParts.day}
                </p>
                <span className="h-14 w-px bg-gold/40 sm:h-16 lg:h-20" />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.25em] text-ivory/70 sm:text-sm lg:text-base">
                    {dateParts.month}
                  </p>
                  <p className="text-xs text-ivory/50 sm:text-sm">{dateParts.year}</p>
                </div>
              </div>

              {event.event_time && (
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">
                  Recepción · {event.event_time}
                </p>
              )}

              <div className="my-6 flex items-center justify-center gap-3">
                <span className="h-px w-16 bg-gold/40" />
                <span className="text-gold">✿</span>
                <span className="h-px w-16 bg-gold/40" />
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {item.table_number && (
                  <span className="inline-block rounded-full border border-gold/40 px-4 py-1 text-xs font-semibold text-ivory/80">
                    Mesa {item.table_number}
                  </span>
                )}
                <span className="inline-block rounded-full border border-gold/40 px-4 py-1 text-xs font-semibold text-ivory/80">
                  {item.party_size} {item.party_size === 1 ? "persona" : "personas"}
                </span>
              </div>

              {event.event_date && (
                <Countdown eventDate={event.event_date} eventTime={event.event_time} size="lg" />
              )}
            </div>
          </section>
        )}

        {showVenue && (
          <section className="relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8">
            <div className="max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">El lugar</p>
              <h2 className="mt-3 font-display text-4xl italic text-ivory sm:text-5xl lg:text-6xl">
                ¿Dónde y cuándo?
              </h2>

              <div className="my-6 flex items-center justify-center gap-3">
                <span className="h-px w-16 bg-gold/40" />
                <span className="text-gold">◆</span>
                <span className="h-px w-16 bg-gold/40" />
              </div>

              {event.venue_name && (
                <p className="font-display text-3xl text-gold sm:text-4xl">{event.venue_name}</p>
              )}
              {event.venue_address && (
                <p className="mt-2 text-lg italic text-ivory/90 sm:text-xl">
                  {event.venue_address}
                </p>
              )}
              {dateParts && (
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-ivory/60">
                  {dateParts.weekday}, {dateParts.day} de {dateParts.month} de {dateParts.year}
                </p>
              )}

              {googleMapsUrl && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-ivory uppercase transition hover:bg-gold/10"
                  >
                    Google Maps
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {showDetails && (
          <section className="relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8">
            <div className="max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">Detalles</p>

              <div
                className={`mt-8 grid gap-6 lg:gap-10 ${event.dress_code && event.gift_note ? "sm:grid-cols-2" : ""}`}
              >
                {event.dress_code && (
                  <div className="border border-gold/40 px-8 py-10 sm:px-10 lg:px-12 lg:py-14">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-ivory sm:text-sm">
                      Código de vestimenta
                    </h3>
                    <div className="my-4 flex items-center justify-center gap-2">
                      <span className="h-px w-8 bg-gold/40" />
                      <span className="text-xs text-gold">◇</span>
                      <span className="h-px w-8 bg-gold/40" />
                    </div>
                    <p className="font-display text-3xl tracking-widest text-gold sm:text-4xl lg:text-5xl">
                      {event.dress_code}
                    </p>
                    {event.color_reservation_note && (
                      <div className="mt-6 border border-gold/30 px-4 py-4 lg:px-6 lg:py-6">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70 sm:text-xs">
                          Reserva de color
                        </p>
                        <p className="mt-2 text-sm italic leading-relaxed text-olive-light sm:text-base">
                          {highlightWords(event.color_reservation_note, [
                            { word: "blanco", className: "text-white" },
                            { word: "marfil", className: "text-white" },
                            { word: "beige", className: "text-white" },
                            { word: "hueso", className: "text-white" },
                          ])}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {event.gift_note && (
                  <div className="border border-gold/40 px-8 py-10 sm:px-10 lg:px-12 lg:py-14">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-ivory sm:text-sm">
                      Regalos
                    </h3>
                    <div className="my-4 flex items-center justify-center gap-2">
                      <span className="h-px w-8 bg-gold/40" />
                      <span className="text-xs text-gold">◇</span>
                      <span className="h-px w-8 bg-gold/40" />
                    </div>
                    <svg
                      viewBox="0 0 48 48"
                      className="mx-auto h-10 w-10 text-gold lg:h-12 lg:w-12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="4" y="10" width="40" height="28" rx="2" />
                      <path d="M5 12 L24 27 L43 12" />
                    </svg>
                    <p className="mt-4 italic leading-relaxed text-ivory/90 sm:text-lg">
                      {event.gift_note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="relative left-1/2 -ml-[50vw] grid min-h-screen w-screen place-items-center px-4 py-16 sm:px-8">
          <div className="max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">
              Te esperamos
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-ivory sm:text-5xl lg:text-6xl">
              Confirmación
              <br />
              de asistencia
            </h2>

            {event.rsvp_deadline && (
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-gold/50 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-gold sm:text-base">
                  Confirma antes del {formatDate(event.rsvp_deadline)}
                </p>
                <p className="mt-1 text-xs text-ivory/80 sm:text-sm">
                  Pasada esta fecha, entenderemos que no podrás acompañarnos.
                </p>
              </div>
            )}

            <div className="mt-6">
              <RsvpButtons code={code} initialStatus={item.rsvp_status} />
            </div>

            <p className="mt-12 font-script text-3xl text-gold sm:text-4xl lg:text-5xl">
              Te esperamos para compartir un momento especial
            </p>

            <div className="my-8 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gold/40 lg:w-24" />
              <span className="text-gold">✿</span>
              <span className="h-px w-16 bg-gold/40 lg:w-24" />
            </div>

            <p className="font-script text-6xl text-gold sm:text-7xl lg:text-8xl">
              {event.couple_names ?? event.title}
            </p>

            {dateParts && (
              <p className="mt-8 text-xs uppercase tracking-[0.25em] text-ivory/60 sm:text-sm">
                {dateParts.weekday}, {dateParts.day} de {dateParts.month} de {dateParts.year}
              </p>
            )}
          </div>
        </section>
      </div>
    </InvitationReveal>
  );
}
