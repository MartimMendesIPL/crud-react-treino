import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - scrollYProgress.getPrevious()!;
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                setVisible(direction < 0);
            }
        }
    });

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-4 inset-x-0 mx-auto w-[90%] md:w-[70%] lg:w-[50%] z-[5000]"
        >
            <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md brutal-border rounded-none shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                <Link to="/" className="text-xl font-editorial italic tracking-wider flex items-center gap-2">
                  <img src="/aura-logo.svg" alt="AURA Logo" width={32} height={32} />
                  <p className="font-bold pl-2">AURA</p>
                </Link>

                <div className="hidden md:flex space-x-8 text-xs font-tech uppercase tracking-[0.2em] text-gray-400">
                    <a href="#features" className="hover:text-cyan-400 transition-colors">Feat</a>
                    <a href="#pricing" className="hover:text-cyan-400 transition-colors">Cost</a>
                    <a href="#architecture" className="hover:text-cyan-400 transition-colors">Stack</a>
                </div>

                <div className="flex items-center space-x-4">
                </div>
            </div>
        </motion.div>
    );
}
