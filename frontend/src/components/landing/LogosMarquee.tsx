import { motion } from "motion/react";

export function LogosMarquee() {
  const logos = [
    { name: "Samsung", url: "https://cdn.simpleicons.org/uber/06b6d4" },
    { name: "Sony", url: "https://cdn.simpleicons.org/sony/06b6d4" },
    { name: "Uber", url: "https://cdn.simpleicons.org/puma/06b6d4" },
    { name: "Visa", url: "https://cdn.simpleicons.org/visa/06b6d4" },
    { name: "Cisco", url: "https://cdn.simpleicons.org/cisco/06b6d4" },
    { name: "Intel", url: "https://cdn.simpleicons.org/intel/06b6d4" },
    { name: "Ebay", url: "https://cdn.simpleicons.org/ebay/06b6d4" },
    { name: "AMD", url: "https://cdn.simpleicons.org/nike/06b6d4" },
  ];

  return (
    <section className="w-full py-6 overflow-hidden flex items-center relative z-20">
      <div className="flex whitespace-nowrap overflow-hidden w-full relative">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 65, // Logo Velocity
          }}
          className="flex flex-nowrap shrink-0 items-center"
        >
          {[
            ...logos,
            ...logos,
            ...logos,
            ...logos,
            ...logos,
            ...logos,
            ...logos,
            ...logos,
          ].map((logo, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <img
                src={logo.url}
                alt={logo.name}
                className="h-40 w-auto object-contain mx-12 opacity-90 hover:opacity-100 transition-opacity drop-shadow-sm"
              />
              <span className="text-cyan-500 text-xl opacity-30 font-tech mr-12" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
