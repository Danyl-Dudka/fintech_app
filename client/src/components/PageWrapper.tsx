import type { Transition } from "framer-motion"
import { motion } from "framer-motion"
import type { ReactNode } from "react"


const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
}

const pageTransition: Transition = {
    type: "tween",
    ease: "easeOut",
    duration: 0.4,
}
export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
        >
            {children}
        </motion.div>
    )
}
