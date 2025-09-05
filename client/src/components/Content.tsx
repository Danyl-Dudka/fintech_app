import { useContext } from "react";
import MainPage from "./MainPage/MainPage";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContext } from "../content";
import InfoHeader from "./InfoHeader/InfoHeader";
import InfoFooter from "./InfoFooter/InfoFooter";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import ContactsPage from "./ContactsPage/ContactsPage";
import DashboardPage from "./DashboardPage/DashboardPage";
import FeaturesPage from "./FeaturesPage/FeaturesPage";
import PricingPage from "./PricingPage/PricingPage";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ProjectApp from "./ProjectApp/ProjectApp";
import TransactionsPage from "./TransactionsHistory/TransactionsPage";
export default function Content() {
  const { isAuth } = useContext(AuthContext);

  const location = useLocation();

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
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={isAuth ? (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ height: "100%" }}
            >
              <ProjectApp />
            </motion.div>) : (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ height: "100%" }}
            >
              <InfoHeader />
              <MainPage />
              <InfoFooter />
            </motion.div>
          )}
        ></Route>

        <Route
          path="/contacts"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <InfoHeader />
            <ContactsPage />
            <InfoFooter />
          </motion.div>}
        />

        <Route
          path="/dashboard"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <InfoHeader />
            <DashboardPage />
            <InfoFooter />
          </motion.div>
          }
        />

        <Route
          path="/features"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <InfoHeader />
            <FeaturesPage />
            <InfoFooter />
          </motion.div>
          }
        />

        <Route
          path="/pricing"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <InfoHeader />
            <PricingPage />
            <InfoFooter />
          </motion.div>
          }
        />

        <Route
          path="/login"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <LoginPage />
          </motion.div>
          }
        />


        <Route
          path="/register"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <RegisterPage />
          </motion.div>
          }
        />

        <Route
          path="/app/:userId"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <ProjectApp />
          </motion.div>
          }
        />

        <Route
          path="/app/:userId/all_transactions"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <TransactionsPage type='all' />
          </motion.div>
          }
        />

        <Route
          path="/app/:userId/incomes_transactions"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <TransactionsPage type="income" />
          </motion.div>
          }
        />

        <Route
          path="/app/:userId/expenses_transactions"
          element={<motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <TransactionsPage type="expense" />
          </motion.div>
          }
        />

      </Routes>
    </AnimatePresence>
  )
}
