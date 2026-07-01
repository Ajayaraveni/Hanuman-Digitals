import { Reveal, SectionLabel } from "./Reveal";
import { MapPin, Phone, Mail } from "lucide-react";

const locations: Array<{
  city: string;
  name: string;
  address: string;
  phone: string;
  tel: string;
  email?: string;
}> = [
  {
    city: "Hyderabad",
    name: "Hanuman Digitals",
    address:
      "Beside Aurora Degree College, Street No.12, Chikkadapally, Hyderabad - 500020",
    phone: "+91 88855 26529",
    tel: "+918885526529",
  },
  {
    city: "Adilabad",
    name: "Hanuman Colour Lab and Studios",
    address: "Maheshwari Theatre Road, Cinema Road, Adilabad - 504001",
    phone: "+91 98495 94302",
    tel: "+919849594302",
  },
  {
    city: "Nirmal",
    name: "Hanuman Colour Lab and Studios",
    address: "Narayan Reddy Market, Nirmal - 504106",
    phone: "+91 98665 30302",
    tel: "+919866530302",
  },
  {
    city: "Nizamabad",
    name: "Hanuman Colour Lab and Studios",
    address:
      "Haricharan Complex, Shop No.3, Beside Bus Stand, Nizamabad - 503001",
    phone: "+91 98665 32302",
    tel: "+919866532302",
  },
  {
    city: "Princeton, Texas, USA",
    name: "Sowmya's Photography",
    address: "Princeton, Texas, USA",
    phone: "+1 (678) 491-4316",
    tel: "+16784914316",
    email: "soumyasphotographyusa@gmail.com",
  },

];

export function Locations() {
  return (
    <section id="locations" className="py-28 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Reveal><SectionLabel>Our Studios</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Serving Across <span className="italic text-gradient-gold">Telangana</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {locations.map((l, i) => (
            <Reveal key={l.city} delay={i * 0.08}>
              <div className="p-8 border border-border rounded-sm bg-card/40 h-full hover:border-gold/50 hover:bg-card transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">
                  {l.city}
                </div>
                <h3 className="font-serif text-xl mb-5">{l.name}</h3>
                <div className="flex gap-3 text-sm text-muted-foreground leading-relaxed mb-4">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{l.address}</span>
                </div>
                <a
                  href={`tel:${l.tel}`}
                  className="flex gap-3 text-sm hover:text-gold transition-colors mb-2"
                >
                  <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{l.phone}</span>
                </a>
                {l.email && (
                  <a
                    href={`mailto:${l.email}`}
                    className="flex gap-3 text-sm hover:text-gold transition-colors break-all"
                  >
                    <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span>{l.email}</span>
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
