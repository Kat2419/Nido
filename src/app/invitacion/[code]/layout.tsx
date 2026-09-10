import { FallingPetals } from "./falling-petals";

export default function InvitacionLayout({ children }: LayoutProps<"/invitacion/[code]">) {
  return (
    <div className="relative min-h-screen px-4 py-10 sm:py-16">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/petals/madera.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />
      <FallingPetals />
      <div className="relative mx-auto max-w-lg">{children}</div>
    </div>
  );
}
